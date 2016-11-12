const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const printModels = require('../builders/printModels');

const upperCamelCase = require('uppercamelcase');
const camelCase = require('camelcase');
const router = require('express').Router();
module.exports = router;

// const modelHeader = 'const Sequelize = require(\'sequelize\');\n' +
//                     'const db = require(\'./_db\');\n\n';


// const printModel = model => {
//   let output = `const ${upperCamelCase(model.name)} = db.define('${model.name}', {\n`;
//   model.fields.forEach((field, idx) => {
//     output += `\t${camelCase(field.name)}: Sequelize.${field.type},\n`;
//   });
//   output += '})\n';
//   return output;
// };

// const printModels = models => {
//   let output = [];
//   models.forEach(model => output.push(printModel(model)))
//   return output.join('\n');
// }

router.get('/', (req, res, next) => res.json({iAm: 'json'}));

router.post('/', (req, res, next) => {
  console.log(chalk.blue(__dirname));
  fs.writeFile(path.join(__dirname, 'temp/temp.js'), printModels(req.body.models), (err) => {
    if (err) next(err);
    res.sendStatus(201);
  });
});
