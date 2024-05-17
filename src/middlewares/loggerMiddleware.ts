import express, { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const winstonLogger = (req: Request, res: Response, next: NextFunction) => {
  const currentDate = new Date();
  logger.info(`${req.method} [${currentDate.toUTCString()}] ${req.ip} FROM ${req.url}`);
  next();
};