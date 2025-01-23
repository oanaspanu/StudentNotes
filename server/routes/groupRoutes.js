const express = require('express');
const Group = require('../sequelize/Group');
const User = require('../sequelize/User');
const Note = require('../sequelize/Note');
const { verifyLogIn } = require('./authentication');
const app = express();

// Route to fetch all groups
app.get("/", async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.status(200).json(groups);
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
});

// Route to create a new group
app.post("/", verifyLogIn, async (req, res) => {
  try {
    const userId = req.user.id; 
    const { groupName } = req.body; 

    const group = await Group.create({ name: groupName, admin: userId });

    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Failed to create group" });
  }
});

// Route to invite colleagues to a group
app.post("/:groupId/invite", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { colleagueEmails } = req.body; 

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!colleagueEmails || colleagueEmails.length === 0) {
      return res.status(400).json({ message: "No colleague emails provided" });
    }

    const colleagues = await User.findAll({
      where: { email: colleagueEmails }
    });

    if (colleagues.length === 0) {
      return res.status(404).json({ message: "No colleagues found with the provided emails" });
    }

    await group.addUsers(colleagues);

    res.status(200).json({ message: "Colleagues invited successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to invite colleagues", error: err.message });
  }
});

// Route to share notes with a group
app.post("/:groupId/notes", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { noteIds } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!noteIds || noteIds.length === 0) {
      return res.status(400).json({ message: "No note IDs provided" });
    }

    const notes = await Note.findAll({
      where: { id: noteIds }
    });

    if (notes.length === 0) {
      return res.status(404).json({ message: "No notes found with the provided IDs" });
    }

    await group.addNotes(notes);

    res.status(200).json({ message: "Notes shared successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to share notes", error: err.message });
  }
});

// Route to get all notes for a group
app.get("/:groupId/notes", async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId, {
      include: [{ model: Note }] 
    });

    if (!group) return res.status(404).json({ message: "Group not found" });
    
    res.status(200).json(group.Notes); 
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// Route to delete a group
app.delete("/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    await group.destroy();
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error("Error deleting group:", err);
    res.status(500).json({ message: "Failed to delete group" });
  }
});

module.exports = app;