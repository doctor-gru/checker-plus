import express from "express";
import { requireApiKey } from "../middlewares";
import { getDailyNewUsers, registerUserByWallet } from "../controller/user";
import { verifySignup } from "../utils/etherutils";
import passport from "passport";

const router = express.Router();

router.post("/register", async (req, res) => {
  const signedMessage = (req.body as any).signedMessage;
  const walletAddress = (req.body as any).walletAddress;
  
  const verified = await verifySignup(walletAddress, signedMessage);
  if (!verified)
    return res.status(401).send({ success: false, error: "Unauthorized" });

  const data = await registerUserByWallet((req.body as any).walletAddress);
  return res.status(200).send(data);
});

router.post(
  "/login", 
  passport.authenticate('wallet'),
  async (req, res) => {
    return res.status(200).send({ success: true });
  }
)

router.get("/getDailyNewUsers", requireApiKey, async (req, res) => {
  const data = await getDailyNewUsers();
  return res.status(200).send(data);
});

export default router;
