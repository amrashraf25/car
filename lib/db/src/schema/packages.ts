import { pgTable, serial, text, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const packagesTable = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  itemsJson: text("items_json").notNull().default("[]"),
  tier: text("tier", { enum: ["basic", "full", "premium"] }).notNull(),
});

export const insertPackageSchema = createInsertSchema(packagesTable).omit({
  id: true,
});
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packagesTable.$inferSelect;
