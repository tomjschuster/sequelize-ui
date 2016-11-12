const Sequelize = require('sequelize');
const db = require('./_db');

const Qwer = db.define('qwer', {
	asdf: Sequelize.FLOAT,
})
