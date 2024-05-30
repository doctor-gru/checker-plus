import { Express } from 'express';

import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import apiRoutes from './apiRoutes';

import { requireApiKey } from '../middlewares';
import { availableHosts } from '../controller/api';

export const configureRoutes = (app: Express) => {
  app.use('/auth', authRoutes);
  app.use('/profile', profileRoutes);
  app.use('/api', apiRoutes);
  app.get('/', (req, res) => {
    res.render('home', { user: req.user });
  });
  app.get('/hosts', requireApiKey, async (req, res) => {
    const data = await availableHosts();
    res.render('hosts', { data })
  });
}