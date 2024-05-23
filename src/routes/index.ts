import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import apiRoutes from './apiRoutes';

import { Express } from 'express';

export const configureRoutes = (app: Express) => {
  app.use('/auth', authRoutes);
  app.use('/profile', profileRoutes);
  app.use('/api', apiRoutes);
  app.get('/', (req, res) => {
    res.render('home', { user: req.user });
  });
}