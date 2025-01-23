const express = require("express");
const multer = require("multer");
const Note = require("../sequelize/Note");
const User = require("../sequelize/User");
const { Subject } = require('../sequelize/Subject');
const { verifyLogIn } = require("./authentication");
const app = express();

// Configure Multer for file uploads
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./notefiles"),
  filename: (req, file, cb) => cb(null, Date.now() + "--" + file.originalname),
});
const upload = multer({ storage: fileStorage });

//Get all notes for the logged-in user.
app.get('/', async (req, res) => {
  const { subjectId } = req.query;
  try {
    let notes;
    if (subjectId) {
      notes = await Note.findAll({ where: { subjectId } });
    } else {
      notes = await Note.findAll();
    }
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

//Create a new note.
app.post("/", verifyLogIn, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.session.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { text, link, fileName } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Note text is required" });
    }

    const note = await Note.create({
      text,
      file: link || null,
      fileName: fileName || null,
      creatorId: user.id,
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});


//Update a note by ID.
app.put("/:noteId", verifyLogIn, async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { text, link, fileName } = req.body;

    const note = await Note.findByPk(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.text = text || note.text;
    note.file = link || note.file;
    note.fileName = fileName || note.fileName;

    await note.save();
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
});

//Delete a note by ID.
app.delete("/:noteId", verifyLogIn, async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByPk(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await note.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

//Upload a file for a note.
app.post(
  "/:noteId/upload",
  verifyLogIn,
  upload.single("file"),
  async (req, res, next) => {
    try {
      const { noteId } = req.params;

      const note = await Note.findByPk(noteId);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      note.file = `/notefiles/${req.file.filename}`;
      note.fileName = req.file.originalname;

      await note.save();
      res.status(200).json(note);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = app;
