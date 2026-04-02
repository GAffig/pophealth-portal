import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { domainsTable } from "./domains";

export const indicatorsTable = pgTable("indicators", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  domainId: integer("domain_id").notNull().references(() => domainsTable.id),
  domainName: text("domain_name").notNull(),
  domainSlug: text("domain_slug").notNull(),
  state: text("state").notNull(),
  county: text("county").notNull(),
  region: text("region").notNull(),
  value: text("value").notNull(),
  year: text("year").notNull(),
  source: text("source").notNull(),
  sourceUrl: text("source_url").notNull(),
  authorityRank: integer("authority_rank").notNull().default(3),
  notes: text("notes"),
});

export const insertIndicatorSchema = createInsertSchema(indicatorsTable).omit({ id: true });
export type InsertIndicator = z.infer<typeof insertIndicatorSchema>;
export type Indicator = typeof indicatorsTable.$inferSelect;
