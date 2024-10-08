import express from "express";
import mongoose from "mongoose";
import ngrok from "@ngrok/ngrok";

import { isProd, MONGO_URI, NGROK_DOMAIN, NGROK_AUTHTOKEN, PORT } from "./src/utils/secrets";
import { configureExpress } from "./src/config";
import { configurePassport } from "./src/passport";
import { configureRoutes } from "./src/routes";

import { logger } from "./src/utils/logger";

import { init as initScheduler } from "./src/scheduler";

const app = express();

configureExpress(app);
configurePassport(app);
configureRoutes(app);

connect();

function connect() {
  mongoose.connection.on("disconnected", connect);
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      logger.info(`APP MONGODB CONNECTION SUCCESSFUL`);
      listen();
    })
    .catch((e) => {
      logger.error(
        `APP MONGODB FAILED TO CONNECT ${(e as Error).message.toUpperCase().slice(0, 60)}`,
      );
    });
}

function listen() {
  try {
    app
      .listen(PORT, () => {
        logger.info(`APP LISTENING ON PORT: ${PORT}`);
        initScheduler();
        if (isProd) runNgrok();
      })
      .on("error", (err) => {
        if (!err.message.includes("EADDRINUSE")) {
          logger.error(
            `APP FAILED TO LISTEN ON PORT: ${PORT} ${err.message.toUpperCase().slice(0, 60)}`,
          );
        }
      });
  } catch (e) {
    logger.error(
      `APP FAILED TO LISTEN ON PORT: ${PORT} ${(e as Error).message.toUpperCase().slice(0, 60)}`,
    );
  }
}

function runNgrok() {
  ngrok
    .connect({ addr: PORT, authtoken: NGROK_AUTHTOKEN })
    .then((listener) =>
      console.log(`Ingress established at: ${listener.url()}`),
    )
    .catch((err) => {
      logger.error(`Failed to establish ngrok tunnel: ${err.message}`);
      console.error(`Failed to establish ngrok tunnel: ${err.message}`);
    });
}
