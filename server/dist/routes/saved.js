import express from "express";
import SavedItem from "../models/SavedItem.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router = express.Router();
router.use(requireAuth);
router.post("/", async (req, res) => {
    const { title, link, price, thumbnail } = req.body;
    try {
        const saved = await SavedItem.create({
            userId: req.user.id,
            title,
            link,
            price,
            thumbnail,
        });
        res.json(saved);
    }
    catch (err) {
        console.error("❌ Error saving item:", err);
        res.status(500).json({ error: "Failed to save item" });
    }
});
router.get("/", async (req, res) => {
    try {
        const saved = await SavedItem.find({ userId: req.user.id });
        res.json(saved);
    }
    catch (err) {
        console.error("❌ Error fetching saved items:", err);
        res.status(500).json({ error: "Failed to fetch saved items" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await SavedItem.deleteOne({
            _id: req.params.id,
            userId: req.user.id,
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error("❌ Error deleting item:", err);
        res.status(500).json({ error: "Failed to delete item" });
    }
});
export default router;
