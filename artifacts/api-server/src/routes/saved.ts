import { Router, type IRouter } from "express";
import { db, savedSourcesTable, indicatorsTable } from "@workspace/db";
import { SaveSourceBody, DeleteSavedSourceParams, ListSavedSourcesResponse } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/saved", async (_req, res): Promise<void> => {
  const saved = await db
    .select()
    .from(savedSourcesTable)
    .orderBy(savedSourcesTable.savedAt);

  res.json(ListSavedSourcesResponse.parse(saved));
});

router.post("/saved", async (req, res): Promise<void> => {
  const parsed = SaveSourceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [indicator] = await db
    .select()
    .from(indicatorsTable)
    .where(eq(indicatorsTable.id, parsed.data.indicatorId));

  if (!indicator) {
    res.status(404).json({ error: "Indicator not found" });
    return;
  }

  const [saved] = await db
    .insert(savedSourcesTable)
    .values({
      indicatorId: indicator.id,
      indicatorName: indicator.name,
      county: indicator.county,
      state: indicator.state,
      value: indicator.value,
      year: indicator.year,
      source: indicator.source,
      sourceUrl: indicator.sourceUrl,
      domainName: indicator.domainName,
      notes: parsed.data.notes ?? null,
    })
    .returning();

  res.status(201).json(saved);
});

router.delete("/saved/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteSavedSourceParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(savedSourcesTable)
    .where(eq(savedSourcesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Saved source not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
