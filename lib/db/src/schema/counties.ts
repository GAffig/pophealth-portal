import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const countiesTable = pgTable("counties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  region: text("region").notNull(),
  fips: text("fips").notNull().unique(),
});

export const insertCountySchema = createInsertSchema(countiesTable).omit({ id: true });
export type InsertCounty = z.infer<typeof insertCountySchema>;
export type County = typeof countiesTable.$inferSelect;
