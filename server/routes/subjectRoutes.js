const express = require('express');
const Subject = require('../sequelize/Subject');
const app = express();

app.get('/', async (req, res, next) => {
    try {
      const subjects = await Subject.findAll();
      res.status(200).json(subjects);
    } catch (err) {
      next(err);
    }
});

app.post('/', async (req, res, next) => {
  try {
    if (req.body.subject_name){
        await Subject.create(req.body);
        res.status(201).json({ message: "Subject Added!" });
    } else {
      res.status(400).json({ message: "Missing attributes!" });
    }
  } catch (err) {
    next(err);
  }
});
module.exports = app;