import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';

import { registerUser } from '../controller/user';

const router = express.Router();

router.get('/login', (req, res) => {
  if (req.user) {
    res.redirect('/profile');
  }
  res.render('login');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/signup', async (req, res) => {
  const data = await registerUser({
    email: req.body.email,
    username: req.body.username,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    googleId: '',
    apiKeys: [],
  });
  return res.status(200).send(data);
})

router.post(
  '/login', 
  passport.authenticate('local', { failureRedirect: '/auth/login' }),
  async (req, res) => {
    res.redirect('/profile');
})

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/profile');
});

export default router;
