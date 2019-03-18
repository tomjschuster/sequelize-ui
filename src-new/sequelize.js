import Case from 'case'
import { singularize, pluralize } from 'inflection'

export const files = ({ models, config = {} }) => ({
  name: 'db',
  files: [
    { name: 'index.js', content: dbTemplate({ models, config }) },
    {
      name: 'models',
      files: models.map(model => modelFile({ model, config }))
    }
  ]
})

const modelFile = ({ model, config }) => ({
  name: `${Case.kebab(model.name)}.js`,
  content: modelTemplate({ model, config })
})

// DB

const dbTemplate = ({ models = [], config = {} }) =>
  `'use strict';

const Sequelize = require('sequelize');
${renderModelImports(models)}
const sequelize = new Sequelize({
  ${renderConstructor(config)}
});
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

const renderConstructor = ({
  dialect = 'postgres',
  host = 'localhost',
  database = 'database',
  username = 'username',
  password = 'password',
  snake = false,
  timestamps = true,
  softDeletes = false
}) =>
  kvs(
    [
      { k: 'dialect', v: `'${dialect}'` },
      { k: 'store', v: ':memory', exclude: dialect !== 'sqlite' },
      { k: 'host', v: `'${host}'`, exclude: dialect === 'sqlite' },
      { k: 'database', v: `'${database}'`, exclude: dialect === 'sqlite' },
      { k: 'username', v: `'${username}'`, exclude: dialect === 'sqlite' },
      { k: 'password', v: `'${password}'`, exclude: dialect === 'sqlite' },
      {
        k: 'define',
        v: `{\n    ${renderDefineOpts({
          snake,
          timestamps,
          softDeletes
        })}\n  }`,
        exclude: !snake && timestamps && !softDeletes
      }
    ],
    2
  )

const renderDefineOpts = ({ snake, timestamps, softDeletes }) =>
  kvs(
    [
      { k: 'underscored', v: snake, exclude: !snake },
      { k: 'timestamps', v: timestamps, exclude: timestamps },
      { k: 'paranoid', v: softDeletes, exclude: !softDeletes }
    ],
    4
  )

// Model

const modelTemplate = ({ model: { name, fields = [] }, config = {} }) =>
  `'use strict';

module.exports = (sequelize, DataTypes) => {
  const ${singularize(Case.pascal(name))} = sequelize.define('${singularize(
  Case.pascal(name)
)}', {
    ${renderFields(fields, config)}
  }, {
    ${renderOptions(name, config)}
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

const renderOptions = (name, { snake = false }) =>
  kvs(
    [
      {
        k: 'tableName',
        v: `'${pluralize(Case.snake(name))}'`,
        exclude: !snake
      }
    ],
    4
  )

const kvs = (kvs, depth = 0) =>
  kvs
    .filter(kv => !kv.exclude)
    .map(({ k, v }) => `${k}: ${v}`)
    .join(`,\n${indent(depth)}`)

const indent = depth => new Array(depth).fill(' ').join('')
