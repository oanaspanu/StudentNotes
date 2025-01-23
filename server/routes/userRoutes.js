const express = require('express');
const User = require('../sequelize/User');
const router = express.Router();

// POST Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, password } });

  if (!user) {
    return res.status(403).send({ message: "Incorrect email or password" });
  }

  req.session.id = user.id;
  req.session.email = user.email;

  res.status(200).send({
    message: "Successful login",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// POST Logout
router.post("/logout", async (req, res) => {
  if (req.session.id) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({ message: "Error during logout" });
      }
      res.status(200).send({ message: "Logged out successfully" });
    });
  } else {
    res.status(404).send({ message: "No active session" });
  }
});


// GET Users (for testing purposes)
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST User (Create user)
router.post("/", async (req, res) => {
  try {
    if (req.body.name && req.body.email && req.body.password) {
      await User.create(req.body);
      res.status(201).json({ message: "User Created!" });
    } else {
      res.status(400).json({ message: "Missing attributes!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
