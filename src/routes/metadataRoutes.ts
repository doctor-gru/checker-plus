import express from "express";
import { getTokenImage, getRarity, tokenMetadata } from "../utils/token";
const router = express.Router();

router.get("/:tokenId", async (req, res) => {
  const { tokenId } = req.params;
  const metadata = JSON.parse(JSON.stringify(tokenMetadata));
  if (metadata) {
    metadata.image = getTokenImage(tokenId);
    metadata.name = `PinLink GPU Token ${tokenId}`;
    metadata.attributes = [
      ...metadata.attributes,
      { trait_type: "Rarity", value: getRarity(tokenId) },
    ];
    res.json(metadata);
  } else {
    res.status(404).json({ error: "Metadata not found" });
  }
});

export default router;
