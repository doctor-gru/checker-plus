import express from 'express';
import { registerApiKey, allApiKeys, availableHosts } from '../controller/api'; // Import the new controller function
import { requireLogin, requireApiKey } from '../middlewares';
import { fetchTensordockInstance } from '../utils/scraping';

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
  if (req.query.query === undefined) {
    return res.status(200).send({ success: false, error: 'You need to provide query data' });
  }
  const queryObject = req.query.query as any;

  const id = queryObject.id;
  const duration = queryObject.duration;

  if (typeof id !== 'string' || typeof duration !== 'string') {
    return res.status(200).send({ success: false, error: 'Invalid parameters. `id` and `duration` must be strings' });
  }

  try {
    const data = await fetchTensordockInstance(id, duration);
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({ success: false, error: (e as Error).message });
  }
});

export default router;
