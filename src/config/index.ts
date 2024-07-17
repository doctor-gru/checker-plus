import express, { Express } from 'express'
import cookieSession from 'cookie-session';
import { winstonLogger } from '../middlewares';
import cors from 'cors';
import compression from 'compression';

import cookieParser from 'cookie-parser';

import { COOKIE_KEY } from '../utils/secrets';

const allowedOrigins = ['http://localhost:5174', 'https://pinlink.ai','https://pinlink-d4b7e--dev-kigmof3k.web.app'];

const corsOptions = {
  origin: '*', 
  optionsSuccessStatus: 200 
};

export const configureExpress = (app: Express) => {
  // app.use(cors(corsOptions));
  app.set('view engine', 'ejs');
  app.use(compression());
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: [COOKIE_KEY],
    })
  );
  app.use(winstonLogger);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.disable('x-powered-by');
}
