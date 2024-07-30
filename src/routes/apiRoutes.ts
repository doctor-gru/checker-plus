import express from 'express';
import { registerApiKey, allApiKeys, availableHosts, availableHost, availableRentInstance, availableRentInstances, findUser, registerNewUser } from '../controller/api';
import { requireLogin, requireApiKey } from '../middlewares';
import { batchCallStaking, batchCallToken } from "../web3"
import { _fetch } from '../sync/paperspace';

const router = express.Router();

// Existing routes
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
});

router.get('/hostById/:id', requireApiKey, async (req, res) => {
  try {
    const data = await availableHost(req.params.id);
    return res.status(200).send(data);
  } catch (e) {
    return res.status(200).send({ success: false, error: (e as Error).message });
  }
})

router.get('/rentedInstances', requireApiKey, async (req, res) => {  
  try {
    const data = await availableRentInstances();
    return res.status(200).send(data);
  } catch (e) {
    return res.status(200).send({ success: false, error: (e as Error).message });
  }
});

router.get('/rentedInstanceById/:id', requireApiKey, async (req, res) => {
  try {
    const data = await availableRentInstance(req.params.id);
    return res.status(200).send(data);
  } catch (e) {
    return res.status(200).send({ success: false, error: (e as Error).message });
  }
})

router.post('/registerUser', requireApiKey, async (req, res) => {
  const data = await registerNewUser((req.body as any).walletAddress);
  return res.status(200).send(data);
});

router.get('/getUser', requireApiKey, async (req, res) => {
  const data = await findUser((req.query as any).walletAddress);
  return res.status(200).send(data);
});

router.get('/keys', requireLogin, async (req, res) => {
  const data = await allApiKeys((req.user as any)._id);
  return res.status(200).send(data);
});
  
router.get('/test', async (req, res) => {
  const staking = await batchCallStaking();
  const token = await batchCallToken();
  return res.status(200).send({ ...staking, ...token });
});

export default router;
