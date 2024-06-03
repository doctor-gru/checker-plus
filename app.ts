import express from 'express';
import mongoose from 'mongoose';

import { MONGO_URI, PORT } from './src/utils/secrets';

import { configureExpress } from './src/config';
import { configurePassport } from './src/passport';
import { configureRoutes } from './src/routes';

import { sync } from './src/sync';

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
      console.log('connected to mongodb');
      sync();
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function listen() {
  app.listen(PORT, () => {
    console.log('App listening on port: ' + PORT);
  });
}