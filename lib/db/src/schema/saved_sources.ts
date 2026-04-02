import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { indicatorsTable } from "./indicators";

export const savedSourcesTable = pgTable("saved_sources", {
  id: serial("id").primaryKey(),
  indicatorId: integer("indicator_id").notNull().references(() => indicatorsTable.id),
  indicatorName: text("indicator_name").notNull(),
  county: text("county").notNull(),
  state: text("state").notNull(),
  value: text("value").notNull(),
  year: text("year").notNull(),
  source: text("source").notNull(),
  sourceUrl: text("source_url").notNull(),
  domainName: text("domain_name").notNull(),
  savedAt: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
  notes: text("notes"),
});

export const insertSavedSourceSchema = createInsertSchema(savedSourcesTable).omit({ id: true, savedAt: true });
export type InsertSavedSource = z.infer<typeof insertSavedSourceSchema>;
export type SavedSource = typeof savedSourcesTable.$inferSelect;
