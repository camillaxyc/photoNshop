import express from "express";
import Item from "../models/Item.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const item = await Item.create({ description: req.body.description });
  res.json(item);
});

router.get("/", async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});

router.get("/search", async (req, res) => {
  const { q } = req.query;
  const items = await Item.find({ $text: { $search: q as string } });
  res.json(items);
});

export default router;
