import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const carsTable = pgTable("cars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  color: text("color").notNull(),
  plateNumber: text("plate_number").notNull(),
  carType: text("car_type", {
    enum: ["sedan", "suv", "truck", "hatchback"],
  }).notNull(),
});

export const insertCarSchema = createInsertSchema(carsTable).omit({ id: true });
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof carsTable.$inferSelect;
