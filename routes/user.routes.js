const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Auth } = require("../middelware/authentication");
const UserRoutes = express.Router();

UserRoutes.get("/users", async (req, res) => {
  try {
    const [rows] = await req.db.execute("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

UserRoutes.post("/register", async (req, res) => {
  const { name, mobile, password, email } = req.body;

  try {
    const [users] = await req.db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length > 0) {
      res.status(200).send("Email is already in use. Try with a new email.");
    } else {
      const insertQuery =
        "INSERT INTO users (username, mobile, email, password) VALUES (?, ?, ?, ?)";
      await req.db.execute(insertQuery, [name, mobile, email, password]);

      res.status(201).send("User registered successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
UserRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await req.db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length > 0) {
      const user = users[0];

      if (user.password === password) {
        const token = jwt.sign({ userId: user.id }, process.env.key);

        res.status(201).send({
          msg: "Login successful",
          name: user.username,
          email: user.email,
          mobile: user.mobile,
          token: token,
        });
      } else {
        res.status(200).send("Wrong Credentials");
      }
    } else {
      res.status(200).send("Wrong Credentials");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = { UserRoutes };
