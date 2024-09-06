import { Express } from "express";

import authRoutes from "./authRoutes";
import apiRoutes from "./apiRoutes";
import stakingRoutes from "./stakingRoutes";
import nftRoutes from "./nftRoutes";
import metadataRoutes from "./metadataRoutes";

export const configureRoutes = (app: Express) => {
  app.use("/auth", authRoutes);
  app.use("/api", apiRoutes);
  app.use("/staking", stakingRoutes);
  app.use("/nft", nftRoutes);
  app.use("/metadata", metadataRoutes);
  app.get("/", (req, res) => {
    res.render("home", { user: req.user });
  });
};
