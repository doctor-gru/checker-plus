import express, { NextFunction, Request, Response } from 'express';
import { findApiKey } from '../controller/api';

// middleware to check if the user is logged in
export const requireLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user === undefined) {
    return res.status(200).send({ success: false, error: 'User not available' });
  } else {
    next();
  }
};

export const requireApiKey = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user === undefined) {
    if (req.query.apiKey !== undefined)
    {
      const key = await findApiKey(req.query.apiKey as string);
      if (key.success == false)
        return res.status(200).send(key);

      const currentDate = new Date();
      if (key.data.expiredIn < currentDate) {
        return res.status(200).send({
          success: false,
          error: `Key has expired at ${key.data.expiredIn}`
        })
      }
    } else {
      return res.status(200).send({ success: false, error: 'You need to provide API key' });
    }
  }
  next();
}