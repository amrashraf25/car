import { Router } from "express";
import { db } from "@workspace/db";
import { workersTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  authenticate,
  requireRole,
  type AuthRequest,
} from "../middlewares/auth.js";
import { getIo } from "../socket.js";

const router = Router();

async function enrichWorker(worker: typeof workersTable.$inferSelect) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, worker.userId))
    .limit(1);
  return {
    ...worker,
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        }
      : null,
  };
}

router.get("/", authenticate, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const workers = await db.select().from(workersTable);
    const enriched = await Promise.all(workers.map(enrichWorker));
    res.json(enriched);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authenticate, requireRole("worker"), async (req: AuthRequest, res) => {
  try {
    const [worker] = await db
      .select()
      .from(workersTable)
      .where(eq(workersTable.userId, req.user!.id))
      .limit(1);
    if (!worker) {
      res.status(404).json({ message: "Worker profile not found" });
      return;
    }
    const enriched = await enrichWorker(worker);
    res.json(enriched);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/me/status", authenticate, requireRole("worker"), async (req: AuthRequest, res) => {
  const { status } = req.body as {
    status: "available" | "busy" | "offline";
  };
  try {
    const [worker] = await db
      .update(workersTable)
      .set({ status })
      .where(eq(workersTable.userId, req.user!.id))
      .returning();
    const enriched = await enrichWorker(worker!);
    res.json(enriched);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/me/location", authenticate, requireRole("worker"), async (req: AuthRequest, res) => {
  const { lat, lng } = req.body as { lat: number; lng: number };
  try {
    const [worker] = await db
      .update(workersTable)
      .set({ lat, lng })
      .where(eq(workersTable.userId, req.user!.id))
      .returning();

    const io = getIo();
    if (io) {
      io.emit("worker:location_update", {
        workerId: worker!.id,
        lat,
        lng,
        orderId: worker!.currentOrderId,
      });
    }

    const enriched = await enrichWorker(worker!);
    res.json(enriched);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
