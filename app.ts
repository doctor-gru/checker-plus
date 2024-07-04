import express from 'express';
import mongoose from 'mongoose';
import { MONGO_URI, PORT } from './src/utils/secrets';
import { configureExpress } from './src/config';
import { configurePassport } from './src/passport';
import { configureRoutes } from './src/routes';

import { logger } from './src/utils/logger';

import { init as initScheduler } from './src/scheduler';

const app = express();

configureExpress(app);
configurePassport(app);
configureRoutes(app);

connect();

function connect() {
  mongoose.connection
    .on('disconnected', connect)
    .once('open', listen);
  mongoose.connect(MONGO_URI)
    .then(() => {
      logger.info(`APP MONGODB CONNECTION SUCCESSFUL`);
    })
    .catch((e) => {    
      logger.error(`APP MONGODB FAILED TO CONNECT ${(e as Error).message.toUpperCase().slice(0, 30)}`);
    });
}

function listen() {
  try {
    app.listen(PORT, () => {
      logger.info(`APP LISTENING ON PORT: ${PORT}`);
      initScheduler();
    });
  } catch (e) {
    logger.error(`APP FAILED TO LISTEN ON PORT: ${PORT} ${(e as Error).message.toUpperCase().slice(0, 30)}`);
  }
}