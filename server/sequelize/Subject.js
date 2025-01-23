const sequelize = require('../sequelize/sequelize');
const { DataTypes } = require('sequelize');


const Subject = sequelize.define('subject', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true
      },
      subject_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Subject must have a subject_name!' },
            notEmpty: { msg: 'subject_name must not be empty!' },
        }
      }
});

  
module.exports = Subject;
 
  
