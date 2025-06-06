import express from "express";
const router = express.Router();
router.get("/", async (req, res) => {
    const query = req.query.q;
    const apiKey = process.env.SERPAPI_KEY;
    console.log("🔍 /senarch endpoint hit");
    console.log("Query:", req.query.q);
    if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Missing or invalid search query" });
    }
    if (!apiKey) {
        return res
            .status(500)
            .json({ error: "Missing SERPAPI_KEY in environment variables" });
    }
    try {
        const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&engine=google_shopping&api_key=${apiKey}`;
        const response = await fetch(url);
        const data = (await response.json());
        let results = [];
        if (Array.isArray(data.shopping_results)) {
            results = data.shopping_results.map((item) => ({
                title: item.title ?? "No title",
                price: item.extracted_price
                    ? `$${item.extracted_price}`
                    : "No price listed",
                link: item.product_link ?? "#",
                thumbnail: item.thumbnail ?? "",
            }));
        }
        res.json({ results });
    }
    catch (err) {
        console.error("❌ Search failed:", err);
        res.status(500).json({ error: "Search failed" });
    }
});
export default router;
