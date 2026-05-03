import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, workersTable, usersTable } from "@workspace/db";
import { eq, and, gte, sql } from "drizzle-orm";
import {
  authenticate,
  requireRole,
  type AuthRequest,
} from "../middlewares/auth.js";

const router = Router();

router.get("/stats", authenticate, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [ordersToday] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(ordersTable)
      .where(gte(ordersTable.scheduledDate, today!));

    const [activeWorkers] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(workersTable)
      .where(eq(workersTable.status, "available"));

    const [pendingOrders] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(ordersTable)
      .where(eq(ordersTable.status, "pending"));

    const [revenueResult] = await db
      .select({ total: sql<number>`coalesce(sum(total_price), 0)::float` })
      .from(ordersTable)
      .where(
        and(
          gte(ordersTable.scheduledDate, today!),
          eq(ordersTable.status, "completed"),
        ),
      );

    res.json({
      totalOrdersToday: ordersToday?.count ?? 0,
      activeWorkers: activeWorkers?.count ?? 0,
      pendingOrders: pendingOrders?.count ?? 0,
      revenueToday: revenueResult?.total ?? 0,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/customers", authenticate, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const customers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "customer"));
    res.json(
      customers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatarUrl: u.avatarUrl,
        createdAt: u.createdAt,
      })),
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
