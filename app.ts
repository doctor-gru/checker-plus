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

mongoose.connect(MONGO_URI, () => {
  console.log('connected to mongodb');
});

app.listen(PORT, () => {
  console.log('App listening on port: ' + PORT);
});

sync();