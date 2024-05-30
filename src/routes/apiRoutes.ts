import express from 'express';

import { registerApiKey, allApiKeys } from '../controller/api';
import { availableHosts } from '../controller/api';
import { requireLogin, requireApiKey } from '../middlewares';

const router = express.Router();

router.post('/register', requireLogin, async (req, res) => {
  const data = await registerApiKey((req.user as any)._id);
  return res.status(200).send(data);
});

router.get('/keys', requireLogin, async (req, res) => {
  const data = await allApiKeys((req.user as any)._id);
  return res.status(200).send(data);
});

router.get('/hosts', requireApiKey, async (req, res) => {
  const data = await availableHosts();
  return res.status(200).send(data);
})

export default router;
