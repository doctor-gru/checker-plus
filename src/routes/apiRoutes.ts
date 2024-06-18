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

// graphdata route
// router.get('/dockerGraphData', requireLogin, async (req, res) => {
//   const queryObject = url.parse(req.url, true).query;
//   const id = queryObject.id;
//   const duration = queryObject.duration;

//   if (typeof id !== 'string' || typeof duration !== 'string') {
//     return res.status(400).json({ error: 'Invalid parameters. `id` and `duration` must be strings.' });
//   }

//   try {
//     const data = await dockerGraphData(id, duration);
//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

router.get('/test', async (req, res) => {
  return res.status(200).json({data: await fetchTensordockInstance('99894b4dd500bf0af5a906eb8f85e1c3', '360')});
});

export default router;
