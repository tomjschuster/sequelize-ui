const Sequelize = require('sequelize');
const db = require('./_db');

const Person = db.define('person', {
	name: Sequelize.STRING,
})
