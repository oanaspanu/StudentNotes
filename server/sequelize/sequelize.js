const {Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sequelize/team.db',
    define: {
		timestamps: false
	}
});

module.exports = sequelize; 