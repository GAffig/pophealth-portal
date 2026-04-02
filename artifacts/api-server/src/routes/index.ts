import { Router, type IRouter } from "express";
import healthRouter from "./health";
import domainsRouter from "./domains";
import countiesRouter from "./counties";
import indicatorsRouter from "./indicators";
import searchRouter from "./search";
import savedRouter from "./saved";
import summaryRouter from "./summary";

const router: IRouter = Router();

router.use(healthRouter);
router.use(domainsRouter);
router.use(countiesRouter);
router.use(indicatorsRouter);
router.use(searchRouter);
router.use(savedRouter);
router.use(summaryRouter);

export default router;
