const Sequelize = require('sequelize');
const db = require('./_db');

const Article = db.define('article', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  content: {
    type: Sequelize.TEXT,
  }
});

module.exports = Article;