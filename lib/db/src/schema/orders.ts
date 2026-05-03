import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  workerId: integer("worker_id"),
  carId: integer("car_id").notNull(),
  packageId: integer("package_id").notNull(),
  packageName: text("package_name").notNull(),
  addonsJson: text("addons_json").notNull().default("[]"),
  status: text("status", {
    enum: [
      "pending",
      "confirmed",
      "en_route",
      "in_progress",
      "finishing",
      "completed",
      "cancelled",
    ],
  })
    .notNull()
    .default("pending"),
  scheduledDate: text("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  locationLat: real("location_lat").notNull(),
  locationLng: real("location_lng").notNull(),
  locationAddress: text("location_address").notNull(),
  totalPrice: real("total_price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
