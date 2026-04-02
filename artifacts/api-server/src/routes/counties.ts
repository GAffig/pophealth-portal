import { Router, type IRouter } from "express";
import { db, countiesTable } from "@workspace/db";
import { ListCountiesQueryParams, ListCountiesResponse } from "@workspace/api-zod";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/counties", async (req, res): Promise<void> => {
  const params = ListCountiesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.state) {
    conditions.push(eq(countiesTable.state, params.data.state));
  }
  if (params.data.region) {
    conditions.push(eq(countiesTable.region, params.data.region));
  }

  const counties = conditions.length > 0
    ? await db.select().from(countiesTable).where(and(...conditions)).orderBy(countiesTable.name)
    : await db.select().from(countiesTable).orderBy(countiesTable.name);

  res.json(ListCountiesResponse.parse(counties));
});

export default router;
