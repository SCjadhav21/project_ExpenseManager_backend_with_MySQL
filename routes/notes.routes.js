const express = require("express");

require("dotenv").config();

const NotesRoutes = express.Router();

NotesRoutes.get("/", async (req, res) => {
  try {
    const [rows] = await req.db.execute("SELECT * FROM notes");
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

NotesRoutes.post("/add", async (req, res) => {
  const { title, content } = req.body;

  try {
    const insertQuery = "INSERT INTO notes ( title, content) VALUES (?, ?)";
    await req.db.execute(insertQuery, [title, content]);
    res.status(201).send("Note Added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
NotesRoutes.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteQuery = "DELETE FROM notes WHERE id=?";
    await req.db.execute(deleteQuery, [id]);
    res.status(200).send("Note deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = { NotesRoutes };
