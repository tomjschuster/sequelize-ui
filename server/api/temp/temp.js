const Sequelize = require('sequelize');
const db = require('./_db');

const Thing = db.define('thing', {
	number: Sequelize.INTEGER,
	sometext: Sequelize.TEXT,
})
