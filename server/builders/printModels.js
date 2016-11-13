const upperCamelCase = require('uppercamelcase');
const camelCase = require('camelcase');

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


const printModel = model => {
  let output = `const ${upperCamelCase(model.name)} = db.define('${model.name}', {\n`;
  let fields = model.fields.length ? model.fields.map(printField).join(',\n') : '';
  output += fields;
  output +=  '\n});';
  return output;
};

const printModels = models => {
  let output = modelHeader;
  let outputModels = models.length ? models.map(printModel).join('\n\n') : '';
  output += outputModels;
  return output;
};

module.exports = printModels;
