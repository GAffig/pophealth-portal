import { Router, type IRouter } from "express";
import { db, indicatorsTable } from "@workspace/db";
import { SearchIndicatorsBody, SearchIndicatorsResponse } from "@workspace/api-zod";
import { ilike, eq, and, or } from "drizzle-orm";

const router: IRouter = Router();

router.post("/search", async (req, res): Promise<void> => {
  const parsed = SearchIndicatorsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { query, state, counties, domain } = parsed.data;

  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const searchTerms = queryWords.slice(0, 5);

  const conditions = [];

  if (searchTerms.length > 0) {
    const nameConditions = searchTerms.map(term =>
      or(
        ilike(indicatorsTable.name, `%${term}%`),
        ilike(indicatorsTable.domainName, `%${term}%`),
        ilike(indicatorsTable.source, `%${term}%`)
      )
    );
    conditions.push(or(...nameConditions));
  }

  if (state) {
    conditions.push(eq(indicatorsTable.state, state));
  }

  if (domain) {
    conditions.push(eq(indicatorsTable.domainSlug, domain));
  }

  if (counties && counties.length > 0) {
    const countyConditions = counties.map(c => ilike(indicatorsTable.county, `%${c}%`));
    conditions.push(or(...countyConditions));
  }

  const results = conditions.length > 0
    ? await db.select().from(indicatorsTable).where(and(...conditions)).limit(100)
    : await db.select().from(indicatorsTable).limit(50);

  let interpretation = `Showing county-level data matching "${query}"`;
  if (state) interpretation += ` in ${state}`;
  if (counties && counties.length > 0) interpretation += ` for ${counties.join(", ")}`;

  const cleanResults = results.map(ind => ({ ...ind, notes: ind.notes ?? undefined }));

  res.json(SearchIndicatorsResponse.parse({
    query,
    interpretation,
    results: cleanResults,
    totalCount: cleanResults.length,
  }));
});

export default router;
