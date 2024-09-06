import express, { NextFunction, Request, Response } from "express";
import { findApiKey } from "../controller/api";

// middleware to check if the user is logged in
export const requireLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user === undefined) {
    return res
      .status(200)
      .send({ success: false, error: "User not available" });
  } else {
    next();
  }
};

export const requireApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user === undefined) {
    const apiKey = req.headers["authorization"];

    if (!apiKey) {
      return res
        .status(401)
        .send({ success: false, error: "You need to provide an API key" });
    }

    const foundKey = await findApiKey(apiKey);
    if (!foundKey.success) {
      return res.status(401).send(foundKey);
    }

    // const currentDate = new Date();
    // if (foundKey.data.expiredIn < currentDate) {
    //   return res.status(401).send({
    //     success: false,
    //     error: `Key has expired at ${foundKey.data.expiredIn}`
    //   });
    // }
  }
     
  next();
};
