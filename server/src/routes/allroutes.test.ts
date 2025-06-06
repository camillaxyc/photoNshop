import request from "supertest";
import mongoose from "mongoose";
import app from "../routes/testServer.js";

let token = "";
let savedId = "";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!, {
    dbName: "photoNshop-test",
  });
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe("🧪 Full backend route test", () => {
  it("POST /auth/register returns token", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "test@example.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("POST /auth/login, returns token", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("POST /items, creates item", async () => {
    const res = await request(app).post("/items").send({
      description: "New item test",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("New item test");
  });

  it("GET /items, gets all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /saved, saves item", async () => {
    const res = await request(app)
      .post("/saved")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Saved item",
        link: "https://example.com",
        price: "$9.99",
        thumbnail: "https://example.com/image.png",
      });
    expect(res.statusCode).toBe(200);
    savedId = res.body._id;
  });

  it("GET /saved, gets saved items", async () => {
    const res = await request(app)
      .get("/saved")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("DELETE /saved/:id,  deletes saved item", async () => {
    const res = await request(app)
      .delete(`/saved/${savedId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("GET /search?q=hat, runs search", async () => {
    const res = await request(app).get("/search?q=hat");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("results");
  });
});
