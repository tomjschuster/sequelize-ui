const upperCamelCase = require('uppercamelcase');
const camelCase = require('camelcase');

const modelHeader = 'const Sequelize = require(\'sequelize\');\n' +
                    'const db = require(\'./_db\');\n\n';


const printField = field => {
  let output = `  ${camelCase(field.name)}: {\n`;
  output += `    type: Sequelize.${field.type},\n`;
  if (field.allowNull !== undefined) output += `    allowNull: ${field.allowNull},\n`;
  if (field.unique !== undefined) output += `    tunique: ${field.unique},\n`;
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
