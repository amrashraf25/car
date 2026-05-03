import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, usersTable, carsTable, workersTable } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  authenticate,
  requireRole,
  type AuthRequest,
} from "../middlewares/auth.js";
import { getIo } from "../socket.js";

const router = Router();

async function enrichOrder(order: typeof ordersTable.$inferSelect) {
  const [customer] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, order.customerId))
    .limit(1);
  const [car] = await db
    .select()
    .from(carsTable)
    .where(eq(carsTable.id, order.carId))
    .limit(1);
  let worker = null;
  if (order.workerId) {
    const [w] = await db
      .select()
      .from(workersTable)
      .where(eq(workersTable.id, order.workerId))
      .limit(1);
    if (w) {
      const [wu] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, w.userId))
        .limit(1);
      worker = { ...w, user: wu ?? null };
    }
  }
  return {
    ...order,
    addons: JSON.parse(order.addonsJson) as unknown[],
    customer: customer
      ? {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          role: customer.role,
          avatarUrl: customer.avatarUrl,
          createdAt: customer.createdAt,
        }
      : null,
    car: car ?? null,
    worker,
  };
}

router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, workerId } = req.query as {
      status?: string;
      workerId?: string;
    };
    let query = db.select().from(ordersTable).$dynamic();
    if (req.user!.role === "customer") {
      query = query.where(eq(ordersTable.customerId, req.user!.id));
    } else if (req.user!.role === "worker") {
      const [w] = await db
        .select()
        .from(workersTable)
        .where(eq(workersTable.userId, req.user!.id))
        .limit(1);
      if (w) {
        query = query.where(eq(ordersTable.workerId, w.id));
      }
    }
    const orders = await query.orderBy(desc(ordersTable.createdAt));
    const enriched = await Promise.all(orders.map(enrichOrder));
    res.json(enriched);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/",
  authenticate,
  requireRole("customer"),
  async (req: AuthRequest, res) => {
    const {
      carId,
      packageId,
      addons,
      scheduledDate,
      scheduledTime,
      locationLat,
      locationLng,
      locationAddress,
      totalPrice,
    } = req.body as {
      carId: number;
      packageId: number;
      addons: unknown[];
      scheduledDate: string;
      scheduledTime: string;
      locationLat: number;
      locationLng: number;
      locationAddress: string;
      totalPrice: number;
    };
    try {
      const [pkg] = await db
        .select()
        .from(
          (await import("@workspace/db")).packagesTable,
        )
        .where(
          eq(
            (await import("@workspace/db")).packagesTable.id,
            packageId,
          ),
        )
        .limit(1);

      const [availableWorker] = await db
        .select()
        .from(workersTable)
        .where(eq(workersTable.status, "available"))
        .limit(1);

      const [order] = await db
        .insert(ordersTable)
        .values({
          customerId: req.user!.id,
          workerId: availableWorker?.id ?? null,
          carId,
          packageId,
          packageName: pkg?.name ?? "Custom",
          addonsJson: JSON.stringify(addons),
          scheduledDate,
          scheduledTime,
          locationLat,
          locationLng,
          locationAddress,
          totalPrice,
          status: availableWorker ? "confirmed" : "pending",
        })
        .returning();

      if (availableWorker) {
        await db
          .update(workersTable)
          .set({ status: "busy", currentOrderId: order!.id })
          .where(eq(workersTable.id, availableWorker.id));
        const io = getIo();
        if (io) {
          io.emit("worker:job_assigned", { orderId: order!.id, workerId: availableWorker.id });
        }
      }

      const enriched = await enrichOrder(order!);
      res.status(201).json(enriched);
    } catch (err) {
      req.log.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
);

router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params["id"]!);
  try {
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .limit(1);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    const enriched = await enrichOrder(order);
    res.json(enriched);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/status", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params["id"]!);
  const { status } = req.body as { status: string };
  try {
    const [order] = await db
      .update(ordersTable)
      .set({ status: status as (typeof ordersTable.$inferSelect)["status"] })
      .where(eq(ordersTable.id, id))
      .returning();

    if (status === "completed" && order?.workerId) {
      await db
        .update(workersTable)
        .set({ status: "available", currentOrderId: null })
        .where(eq(workersTable.id, order.workerId));
    }

    const io = getIo();
    if (io) {
      io.emit("order:status_change", { orderId: id, status });
    }

    const enriched = await enrichOrder(order!);
    res.json(enriched);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put(
  "/:id/assign",
  authenticate,
  requireRole("admin"),
  async (req: AuthRequest, res) => {
    const id = parseInt(req.params["id"]!);
    const { workerId } = req.body as { workerId: number };
    try {
      const [order] = await db
        .update(ordersTable)
        .set({ workerId, status: "confirmed" })
        .where(eq(ordersTable.id, id))
        .returning();
      const enriched = await enrichOrder(order!);
      res.json(enriched);
    } catch (err) {
      req.log.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
);

export default router;
