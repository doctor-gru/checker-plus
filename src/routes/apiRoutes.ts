import express from "express";

import { findApiKey, registerApiKey, allApiKeys } from "../controller/api";
import { availableHosts } from "../controller/api";

const router = express.Router();

router.post("/register", async (req, res) => {
  if (req.user === undefined)
    return res.status(200).send({ success: false, error: "User not available" });

  const data = await registerApiKey((req.user as any)._id);
  return res.status(200).send(data);
});

router.get("/keys", async (req, res) => {
  if (req.user === undefined)
    return res.status(200).send({ success: false, error: "User not available" });

  const data = await allApiKeys((req.user as any)._id);
  return res.status(200).send(data);
});

router.get("/hosts", async (req, res) => {
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

  const data = await availableHosts();
  return res.status(200).send(data);
})

export default router;
