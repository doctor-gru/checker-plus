import express, { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const winstonLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.ip} FROM ${req.url}`);
  next();
};