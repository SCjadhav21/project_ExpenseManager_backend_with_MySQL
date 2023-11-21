require("dotenv").config();
const mysql = require("mysql2/promise");
const express = require("express");
const cors = require("cors");
const { ExpenseRoutes } = require("./routes/expense.routes");
const app = express();
const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const { UserRoutes } = require("./routes/user.routes");
const { IncomeRoutes } = require("./routes/income.routes");
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.use("/user", UserRoutes, (req, res) => {
  res.status(404).send("Routes not found");
});
app.use("/expense", ExpenseRoutes, (req, res) => {
  res.status(404).send("Routes not found");
});
app.use("/income", IncomeRoutes, (req, res) => {
  res.status(404).send("Routes not found");
});

app.listen(process.env.portForApp, () => {
  console.log(
    `Server is running on http://localhost:${process.env.portForApp}`
  );
});
