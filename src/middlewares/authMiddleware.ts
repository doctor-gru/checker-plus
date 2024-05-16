import express, { NextFunction, Request, Response } from "express";

// middleware to check if the user is logged in
export const requireLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.redirect("/auth/login");
  } else {
    next();
  }
};