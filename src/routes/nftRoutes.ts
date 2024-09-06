import express from "express";
import { requireApiKey } from "../middlewares";

import { mintNFT } from "../controller/web3";

const router = express.Router();

router.post("/mint", requireApiKey, async (req, res) => {
  const data = await mintNFT(
    (req.body as any).walletAddress,
    (req.body as any).amount,
    (req.body as any).tokenUri,
  );
  return res.status(200).send(data);
});

export default router;
