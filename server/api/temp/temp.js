const Sequelize = require('sequelize');
const db = require('./_db');

const Abc = db.define('abc', {
  poiu: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    tunique: true,
  },
  wero: {
    type: Sequelize.DATE,
    tunique: true,
  }
})

const Badf = db.define('badf', {

})

const Awerff = db.define('awerff', {
  ewqrqwr: {
    type: Sequelize.DECIMAL,
    tunique: true,
  },
  jlkjlk: {
    type: Sequelize.STRING,
    tunique: true,
  }
})