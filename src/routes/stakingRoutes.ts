import express from 'express';
import { requireApiKey } from '../middlewares';

import { mintNFT, getStakingInformation } from '../controller/web3';

const router = express.Router();

router.get('/info', async (req, res) => {
  const data = await getStakingInformation(Number((req.query as any).records ?? 30));
  return res.status(200).send(data);
});

router.get('/mint', requireApiKey, async (req, res) => {
  const data = await mintNFT((req.body as any).address);
  return res.status(200).send(data);
});

export default router;
