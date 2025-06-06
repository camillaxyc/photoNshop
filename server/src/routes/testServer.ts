import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "../routes/auth";
import itemRoutes from "../routes/items";
import savedRoutes from "../routes/saved";
import searchRoutes from "../routes/search";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/saved", savedRoutes);
app.use("/search", searchRoutes);

export default app;
