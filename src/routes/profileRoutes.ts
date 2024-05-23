import express from 'express';
import { requireLogin } from '../middlewares';

const router = express.Router();

// middleware to check if the user is logged in

router.get('/', requireLogin, (req, res) => {
  res.render('profile', { user: req.user });
});

export default router;
