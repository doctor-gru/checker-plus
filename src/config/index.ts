import express, { Express } from "express"
import cookieSession from "cookie-session";
import morgan from "morgan";
import { winstonLogger } from "../middlewares";

import cookieParser from "cookie-parser";

import { ENVIRONMENT, COOKIE_KEY } from "../utils/secrets";

export const configureExpress = (app: Express) => {
  app.set("view engine", "ejs");
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
}
