import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables.");
    process.exit(1);
}
// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware
app.use(cors());
app.use(express.json());
// Serve frontend from ./public
app.use(express.static(path.join(__dirname, "../public")));
// Test route
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from backend API!" });
});
// Serve React app for all other routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});
// Start server after DB connection
async function startServer() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected");
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
        });
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
}
startServer();
