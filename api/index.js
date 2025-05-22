import express from "express";
import mongoose from "mongoose";
import { json } from "express";

// MongoDB setup
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  dbName: "test",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware example (runs before every request)
const logMiddleware = (req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
};

// Mongoose model
const Item =
  mongoose.models.Item ||
  mongoose.model(
    "Item",
    new mongoose.Schema({
      name: String,
    })
  );

// Create Express app
const app = express();
app.use(json()); // Parses JSON body
app.use(logMiddleware); // Custom middleware

// Routes
app.get("/", async (req, res) => {
  const items = await Item.find();
  res.status(200).json({ message: "Fetched items", items });
});

app.post("/", async (req, res) => {
  const { name } = req.body;
  const newItem = await Item.create({ name });
  res.status(201).json({ message: "Created item", item: newItem });
});

// Wrap Express for Vercel
export default app;
