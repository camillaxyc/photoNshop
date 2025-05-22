const express = require("express");
const { MongoClient } = require("mongodb");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

app.get("/api", async (req, res) => {
  try {
    const client = await connectToDatabase();
    const db = client.db("test"); // Change 'test' to DB name later
    const items = await db.collection("your_collection").find().toArray();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

module.exports = app;
m;
