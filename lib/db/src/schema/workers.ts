import { pgTable, serial, integer, text, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const workersTable = pgTable("workers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  status: text("status", { enum: ["available", "busy", "offline"] })
    .notNull()
    .default("offline"),
  currentOrderId: integer("current_order_id"),
  lat: real("lat"),
  lng: real("lng"),
});

export const insertWorkerSchema = createInsertSchema(workersTable).omit({
  id: true,
});
export type InsertWorker = z.infer<typeof insertWorkerSchema>;
export type Worker = typeof workersTable.$inferSelect;
