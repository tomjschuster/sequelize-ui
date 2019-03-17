import Case from 'case'

export default ({ models = [], config = {} }) =>
  `'use strict';

const Sequelize = require('sequelize');
${renderModelImports(models)}
const sequelize = ${renderConnection(config)};
${renderModelDefs(models)}
module.exports = {
  sequelize,
  Sequelize${renderModelExports(models)}
}`

const renderModelImports = models =>
  models.length ? models.map(model => renderModelImport(model)).join('') : ''

const renderModelImport = ({ name }) =>
  `const ${Case.pascal(name)}Model = require('./models/${Case.kebab(
    name
  )}.js');\n`

const renderModelDefs = models =>
  models.length
    ? '\n' + models.map(model => renderModelDef(model)).join('')
    : ''

const renderModelDef = ({ name }) =>
  `const ${Case.pascal(name)} = ${Case.pascal(
    name
  )}Model(sequelize, Sequelize);\n`

const renderModelExports = models =>
  models.length
    ? ',\n  ' + models.map(({ name }) => Case.pascal(name)).join(',\n  ')
    : ''

const renderConnection = (config = {}) =>
  config.dialect === 'sqlite'
    ? renderSqliteConnection(config)
    : renderNormalConnection(config)

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
}) => `new Sequelize({
  dialect: '${dialect}',
  host: '${host}',
  database: '${database}',
  username: '${username}',
  password: '${password}'
})`
