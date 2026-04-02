import { Router, type IRouter } from "express";
import { db, indicatorsTable } from "@workspace/db";
import { ListIndicatorsQueryParams, ListIndicatorsResponse, GetIndicatorParams, GetIndicatorResponse } from "@workspace/api-zod";
import { eq, and, ilike } from "drizzle-orm";

const router: IRouter = Router();

router.get("/indicators", async (req, res): Promise<void> => {
  const params = ListIndicatorsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.domain) {
    conditions.push(eq(indicatorsTable.domainSlug, params.data.domain));
  }
  if (params.data.state) {
    conditions.push(eq(indicatorsTable.state, params.data.state));
  }
  if (params.data.county) {
    conditions.push(ilike(indicatorsTable.county, `%${params.data.county}%`));
  }

  const rawIndicators = conditions.length > 0
    ? await db.select().from(indicatorsTable).where(and(...conditions)).orderBy(indicatorsTable.name)
    : await db.select().from(indicatorsTable).orderBy(indicatorsTable.name);

  const indicators = rawIndicators.map(ind => ({ ...ind, notes: ind.notes ?? undefined }));
  res.json(ListIndicatorsResponse.parse(indicators));
});

router.get("/indicators/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetIndicatorParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [indicator] = await db
    .select()
    .from(indicatorsTable)
    .where(eq(indicatorsTable.id, params.data.id));

  if (!indicator) {
    res.status(404).json({ error: "Indicator not found" });
    return;
  }

  res.json(GetIndicatorResponse.parse(indicator));
});

export default router;
