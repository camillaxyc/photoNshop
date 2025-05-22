import express from "express";
import mongoose from "mongoose";
import { createServer } from "@vercel/node"; // only needed for full server setup
import { json } from "body-parser";

const app = express();
app.use(json());

// MongoDB connection (runs once)
mongoose.connect(process.env.MONGODB_URI, {
  dbName: "test",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Item = mongoose.model("Item", new mongoose.Schema({ name: String }));

// Sample route
app.get("/", async (req, res) => {
  const items = await Item.find();
  res.status(200).json({ message: "Items fetched", items });
});

app.post("/", async (req, res) => {
  const { name } = req.body;
  const newItem = await Item.create({ name });
  res.status(201).json({ message: "Item created", item: newItem });
});

// Export the Express app as a handler for Vercel
export default app;
