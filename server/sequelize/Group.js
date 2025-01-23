const sequelize = require('../sequelize/sequelize');
const { DataTypes } = require('sequelize');


const Group = sequelize.define('group', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Group must have a name!' },
        notEmpty: { msg: 'Name must not be empty!' },
      },
    },
    admin:{
        type : DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Group must have an admin!' },
          notEmpty: { msg: 'admin must not be empty!' },
        },
    }
  })
  
    
  module.exports = Group;
   
    
  