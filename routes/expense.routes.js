const express = require("express");
const { Auth } = require("../middelware/authentication");
require("dotenv").config();

const ExpenseRoutes = express.Router();

ExpenseRoutes.get("/", Auth, async (req, res) => {
  try {
    const [rows] = await req.db.execute(
      "SELECT * FROM expence WHERE userID = ?",
      [req.body.userId]
    );
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

ExpenseRoutes.get("/sortbyDate/:order", Auth, async (req, res) => {
  try {
    const [rows] = await req.db.execute(
      `SELECT * FROM expence WHERE userId = ? ORDER BY Date ${req.params.order}`,
      [req.body.userId]
    );
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
ExpenseRoutes.get("/getByMonth/:month", Auth, async (req, res) => {
  const month = req.params.month;

  try {
    // Use parameterized query to avoid SQL injection
    const [rows] = await req.db.execute(
      `SELECT * FROM expence WHERE MONTH(\`Date\`) = ?`,
      [month]
    );

    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

ExpenseRoutes.get("/totalexpense", Auth, async (req, res) => {
  const userId = req.body.userId;

  try {
    const selectQuery =
      "SELECT SUM(amount) AS totalAmount FROM expence WHERE userId = ?";
    const [rows] = await req.db.execute(selectQuery, [userId]);

    const totalAmount = rows[0].totalAmount;

    res.status(200).send(totalAmount);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

ExpenseRoutes.post("/addexpense", Auth, async (req, res) => {
  const { amount, category, date, description, userId } = req.body;

  try {
    const insertQuery =
      "INSERT INTO expence ( amount, category, date, description, userId ) VALUES (?, ?, ?, ?,?)";
    await req.db.execute(insertQuery, [
      amount,
      category,
      date,
      description,
      userId,
    ]);
    res.status(201).send("Expense Added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = { ExpenseRoutes };
