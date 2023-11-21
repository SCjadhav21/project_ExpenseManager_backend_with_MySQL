const express = require("express");
const { Auth } = require("../middelware/authentication");
require("dotenv").config();

const IncomeRoutes = express.Router();

IncomeRoutes.get("/", Auth, async (req, res) => {
  try {
    const [rows] = await req.db.execute(
      "SELECT * FROM income WHERE userID = ?",
      [req.body.userId]
    );
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

IncomeRoutes.get("/totalincome", Auth, async (req, res) => {
  const userId = req.body.userId;

  try {
    const selectQuery =
      "SELECT SUM(amount) AS totalAmount FROM income WHERE userId = ?";
    const [rows] = await req.db.execute(selectQuery, [userId]);

    const totalAmount = rows[0].totalAmount;

    res.status(200).send(totalAmount);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
IncomeRoutes.get("/sortbyDate/:order", Auth, async (req, res) => {
  try {
    const [rows] = await req.db.execute(
      `SELECT * FROM income WHERE userId = ? ORDER BY Date ${req.params.order}`,
      [req.body.userId]
    );
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
IncomeRoutes.get("/getByMonth/:month", Auth, async (req, res) => {
  const month = req.params.month;

  try {
    // Use parameterized query to avoid SQL injection
    const [rows] = await req.db.execute(
      `SELECT * FROM income WHERE MONTH(Date) = ?`,
      [month]
    );

    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

IncomeRoutes.post("/addincome", Auth, async (req, res) => {
  const { amount, receivedBy, date, description, paymentSource, userId } =
    req.body;
  try {
    const insertQuery =
      "INSERT INTO income (amount, receivedBy, date, description, paymentSource, userId) VALUES (?, ?, ?, ?, ?, ?)";
    await req.db.execute(insertQuery, [
      amount,
      receivedBy,
      date,
      description,
      paymentSource,
      userId,
    ]);
    res.status(201).send("Income Added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = { IncomeRoutes };
