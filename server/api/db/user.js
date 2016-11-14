const Sequelize = require('sequelize');
const db = require('./_db');

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  dob: {
    type: Sequelize.DATEONLY,
  }
});

module.exports = User;