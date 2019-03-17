import Case from 'case'

const db = ({ models = [], opts = {} }) =>
  `const Sequelize = require('sequelize');
${models.map(model => renderModelImport(model)).join('\n')}

const sequelize = ${renderConnection(opts)};

${models.map(model => renderDefineModel(model)).join('\n')}

module.exports = {
    sequelize,
    Sequelize${models.length ? ',' : ''}
    ${models.map(({ name }) => Case.pascal(name)).join(',\n\t')}
}`

const renderModelImport = ({ name }) =>
  `${Case.pascal(name)}Model = require('./models/${Case.kebab(name)}.js');`

const renderDefineModel = ({ name }) =>
  `${Case.pascal(name)} = ${Case.pascal(name)}Model(sequelize, Sequelize);`

const renderConnection = (opts = {}) =>
  opts.dialect === 'sqlite'
    ? renderSqliteConnection(opts)
    : renderNormalConnection(opts)

const renderSqliteConnection = ({ storage = ':memory' }) => `new Sequelize({
    dialect: 'sqlite',
    storage: '${storage}'
})`

const renderNormalConnection = ({
  dialect = 'postgres',
  host = 'localhost',
  database = 'database',
  username = 'username',
  password = 'password'
}) => `const sequelize = new Sequelize({
    dialect: '${dialect}',
    host: '${host}',
    database: '${database}',
    username: '${username}',
    password: '${password}'
})`

// const renderModel = ({ name, attributes = [], config = {} }) => `
// 'use strict';

// module.exports = (sequelize, DataTypes) => {
//   const ${name} = sequelize.define('${name}', {
//     ${attributes
//     .map(attribute => renderAttribute({ attribute, config }))
//     .join(',\n')}
//   }, {
//     ${config.snake ? 'underscored: true,' : ''}
//   });

//   ${name}.associate = function(models) {
//     // associations can be defined here
//   };

//   return ${name};
// };
// `

// const renderAttribute = ({ attribute, config }) => `${attribute.fieldName}: {
//     type: DataTypes.${attribute.dataType}
// }`
