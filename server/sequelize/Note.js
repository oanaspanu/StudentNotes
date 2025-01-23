const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');
const Subject = require('./Subject'); 
const User = require('./User');

const Note = sequelize.define('note', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Note must have a text!' },
      notEmpty: { msg: 'text must not be empty!' },
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true
  },
  creatorId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, 
      key: 'id',
    },
    allowNull: false,
  },
  subjectId: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: 'id',
    },
    allowNull: true,
  }
});

module.exports = Note;


