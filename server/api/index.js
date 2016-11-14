const Promise = require('bluebird');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const randomstring = require("randomstring");
const mkdirp = require('mkdirp');

const upperCamelCase = require('uppercamelcase');
const camelCase = require('camelcase');
const router = require('express').Router();
module.exports = router;

const modelHeader = 'const Sequelize = require(\'sequelize\');\n' +
                    'const db = require(\'./_db\');\n\n';

const printField = field => {
  let output = `  ${camelCase(field.name)}: {\n`;
  output += `    type: Sequelize.${field.type},\n`;
  if (field.allowNull !== undefined) output += `    allowNull: ${field.allowNull},\n`;
  if (field.unique !== undefined) output += `    unique: ${field.uniqueKey ? `'${field.uniqueKey}'` : field.unique},\n`;
  if (field.primaryKey !== undefined) output += `    primaryKey: ${field.primaryKey},\n`;
  if (field.autoIncrement !== undefined) output += `    autoIncrement: ${field.autoIncrement},\n`;
  if (field.defaultValue !== undefined) {
    if (field.type === 'TEXT' || field.type === 'TEXT') field.defaultValue = `'${field.defaultValue}'`;
    output += `    defaultValue: ${field.defaultValue},\n`;
  }
  if (field.comment !== undefined) output += `    comment: '${field.comment}',\n`;
  if (field.field !== undefined) output += `    field: '${field.field}',\n`;
  if (field.validate) {
    output += '    validate: {\n';
    if (field.validate.is !== undefined) output += `      is: ${field.validate.is},\n`;
    if (field.validate.contains !== undefined) output += `      contains: '${field.validate.contains}',\n`;
    if (field.validate.min !== undefined) output += `      min: ${field.validate.min},\n`;
    if (field.validate.max !== undefined) output += `      max: ${field.validate.max},\n`;
    if (field.validate.isEmail !== undefined) output += `      isEmail: ${field.validate.isEmail},\n`;
    if (field.validate.isUrl !== undefined) output += `      isUrl: ${field.validate.isUrl},\n`;
    output += '    }\n'
  }
  output += `  }`;
  return output;
  };


const makeModelFile = model => {
  let output = modelHeader;
  output += `const ${upperCamelCase(model.name)} = db.define('${model.name}', {\n`;
  let fields = model.fields.length ? model.fields.map(printField).join(',\n') : '';
  output += fields;
  output +=  '\n});\n\n';
  output += `module.exports = ${upperCamelCase(model.name)};`;
  return output;
};

// const printModels = models => {
//   let output = modelHeader;
//   let outputModels = models.length ? models.map(printModel).join('\n\n') : '';
//   output += outputModels;
//   return output;
// };

const makeAssociationFile = models => {
  let output = '';
  models.forEach(model => {output += `const ${upperCamelCase(model.name)} = require('./model.name');\n`});
  output += '\n//ASSOCIATIONS\n\n';
  output += `module.exports = {${models.map(model => upperCamelCase(model.name)).join(', ')}};`;
  return output;
}

const writeFile = Promise.promisify(fs.writeFile);

const _db = 'const Sequelize = require(\'sequelize\');\n' +
            'const db = new Sequelize(\'postgres://user:pass@example.com:5432/dbname\');\n' +
            'module.exports = db;';


router.get('/download/:key', function(req, res) {
  res.type('application/zip').download(path.join(__dirname, 'temp', req.params.key, 'db.zip'));
});



router.post('/create', (req, res, next) => {
  let key = randomstring.generate();
  mkdirp(path.join(__dirname, 'temp', `${key}`), (err) => {
    if (err) next(err);

    let { models } = req.body;
    let archive  = archiver('zip');
    let output = fs.createWriteStream(path.join(__dirname, 'temp', `${key}`, 'db.zip'));

    archive.pipe(output);

    archive.append(_db, { name: '_db.js'});
    models.forEach(model => archive.append(makeModelFile(model), { name: `${model.name}.js`}));
    archive.append(makeAssociationFile(models), { name: 'index.js'});

    archive.finalize((err, bytes) => {
      if (err) next(err);
      console.log(Date.now(), bytes + ' total bytes');
    });

    output.on('close', () => res.send(key))

  });
});
