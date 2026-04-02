import { Router, type IRouter } from "express";
import { db, domainsTable, indicatorsTable, countiesTable, savedSourcesTable } from "@workspace/db";
import { GetPortalSummaryResponse } from "@workspace/api-zod";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/summary", async (_req, res): Promise<void> => {
  const [domainsCount] = await db.select({ count: count() }).from(domainsTable);
  const [indicatorsCount] = await db.select({ count: count() }).from(indicatorsTable);
  const [countiesCount] = await db.select({ count: count() }).from(countiesTable);
  const [savedCount] = await db.select({ count: count() }).from(savedSourcesTable);

  const tnCount = await db.select({ count: count() }).from(indicatorsTable).where(eq(indicatorsTable.state, "TN"));
  const vaCount = await db.select({ count: count() }).from(indicatorsTable).where(eq(indicatorsTable.state, "VA"));

  const recentlyViewedRaw = await db
    .select()
    .from(indicatorsTable)
    .limit(5);

  const recentlyViewed = recentlyViewedRaw.map(ind => ({
    ...ind,
    notes: ind.notes ?? undefined,
  }));

  res.json(GetPortalSummaryResponse.parse({
    totalDomains: Number(domainsCount?.count ?? 0),
    totalIndicators: Number(indicatorsCount?.count ?? 0),
    totalCounties: Number(countiesCount?.count ?? 0),
    totalSaved: Number(savedCount?.count ?? 0),
    stateBreakdown: {
      TN: Number(tnCount[0]?.count ?? 0),
      VA: Number(vaCount[0]?.count ?? 0),
    },
    recentlyViewed,
  }));
});

export default router;
