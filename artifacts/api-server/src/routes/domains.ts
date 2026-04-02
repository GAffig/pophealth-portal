import { Router, type IRouter } from "express";
import { db, domainsTable } from "@workspace/db";
import { ListDomainsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/domains", async (req, res): Promise<void> => {
  const domains = await db.select().from(domainsTable).orderBy(domainsTable.name);
  res.json(ListDomainsResponse.parse(domains));
});

export default router;
