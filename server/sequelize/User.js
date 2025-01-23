const sequelize = require('../sequelize/sequelize');
const { DataTypes } = require('sequelize');


const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'User must have a name!' },
      notEmpty: { msg: 'Name must not be empty!' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'User must have a email!' },
      notEmpty: { msg: 'email must not be empty!' },
      isEmail: { msg: 'Must be a valid address!' },
    },
  },password: {
    type: DataTypes.STRING,
    allowNull: false
}
})

  
module.exports = User;
 
  
