import express from 'express';
import { registerApiKey, allApiKeys, availableHosts, availableRentInstance } from '../controller/api'; // Import the new controller function
import { requireLogin, requireApiKey } from '../middlewares';
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

router.get('/rentedInstance', requireApiKey, async (req, res) => {  
  try {
    const data = await availableRentInstance();
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({ success: false, error: (e as Error).message });
  }
});

router.get('/test', async (req, res) => {
  const data = await _fetch();
  return res.status(200).send(data);
});

export default router;
