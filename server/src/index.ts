import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs/promises";
// @ts-ignore
import fetch from "node-fetch";
import searchRouter from "./routes/search";
import authRoutes from "./routes/auth";
import itemRoutes from "./routes/items";
import savedRoutes from "./routes/saved";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173", // local dev frontend
  "https://photonshop.fly.dev", // deployed frontend
];

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const MONGO_URI = process.env.MONGO_URI;

dotenv.config();

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/saved", savedRoutes);
app.use("/search", searchRouter);

app.use(express.static(path.join(__dirname, "../public")));

app.get("*", (req, res, next) => {
  if (req.accepts("html") && !req.path.includes(".")) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  } else {
    next();
  }
});

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    const imagePath = req.file.path;
    const imageBuffer = await fs.readFile(imagePath);
    const base64 = imageBuffer.toString("base64");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout:free",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "What's in this image?" },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${base64}` },
                },
              ],
            },
          ],
        }),
      }
    );

    const result = await response.json();
    console.log("OpenRouter response:", result);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI!);
    console.log("✅ MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

startServer();
