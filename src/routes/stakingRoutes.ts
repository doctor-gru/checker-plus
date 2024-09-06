import express from "express";
import { requireApiKey } from "../middlewares";

import { getStakingInformation } from "../controller/web3";

const router = express.Router();

router.get("/info", requireApiKey, async (req, res) => {
  const data = await getStakingInformation(
    Number((req.query as any).records ?? 30),
  );
  return res.status(200).send(data);
});

export default router;
