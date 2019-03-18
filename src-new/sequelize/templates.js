import Case from 'case'

// DB

export const dbTemplate = ({ models = [], config = {} }) =>
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

// Model

export const modelTemplate = ({
  model: { name, fields = [], config = {} },
  config: {}
}) =>
  `'use strict';

module.exports = (sequelize, DataTypes) => {
  const ${Case.pascal(name)} = sequelize.define('${name}', {
    ${renderFields(fields, config)}
  }, {
    ${renderOptions(config)}
  });

  ${Case.pascal(name)}.associate = function(models) {
    // associations can be defined here
  };

  return ${Case.pascal(name)};
};
`

const renderFields = (fields, config) =>
  fields.map(field => renderField(field, config)).join(',\n    ')

const renderField = (field, config) => `${Case.camel(field.name)}: {
      ${renderFieldKvs(field, config)}
    }`

const renderFieldKvs = (
  { name, type, primaryKey = false, required = false, unique = false },
  { snake = false }
) =>
  kvs(
    [
      { k: 'type', v: 'DataTypes.' + type },
      { k: 'primaryKey', v: primaryKey, exclude: !primaryKey },
      { k: 'allowNull', v: !required, exclude: !required },
      { k: 'unique', v: unique, exclude: !unique },
      { k: 'field', v: `'${Case.snake(name)}'`, exclude: !snake }
    ],
    6
  )

const renderOptions = ({
  snake = false,
  softDeletes = false,
  timestamps = true
}) =>
  kvs(
    [
      { k: 'underscored', v: snake, exclude: !snake },
      { k: 'paranoid', v: softDeletes, exclude: !softDeletes },
      { k: 'timestamps', v: timestamps, exclude: timestamps }
    ],
    4
  )

const kvs = (kvs, depth = 0) =>
  kvs
    .filter(kv => !kv.exclude)
    .map(({ k, v }) => `${k}: ${v}`)
    .join(`,\n${indent(depth)}`)

const indent = depth => new Array(depth).fill(' ').join('')
