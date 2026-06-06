import "dotenv/config";
import express from "express";
import { db } from "./src/db.js";
import { transactions } from "./src/schema.js";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());

app.get("/transactions", async (req, res) => {
  try {
    const all = await db.select().from(transactions);
    res.json(all);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/transactions", async (req, res) => {
  try {
    const { hash, amount, token, sender } = req.body;
    if (!hash || !sender) {
      res.status(400).json({ error: "hash and sender are required" });
      return;
    }
    await db.insert(transactions).values({ hash, amount, token, sender });
    res.status(201).json({ message: "Transaction saved" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET transactions filtered by token
app.get("/transactions/filter", async (req, res) => {
  console.log("FILTER ROUTE HIT — token:", req.query.token);
  try {
    const { token } = req.query;
    if (!token) {
      res.status(400).json({ error: "token query param required" });
      return;
    }
    const result = await db
      .select()
      .from(transactions)
      .where(eq(transactions.token, token as string));
    console.log("Query result:", result);
    res.json(result);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/transactions/:hash", async (req, res) => {
  try {
    const result = await db
      .select()
      .from(transactions)
      .where(eq(transactions.hash, req.params.hash));
    if (result.length === 0) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }
    res.json(result[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
