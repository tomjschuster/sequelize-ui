// import 'core-js/features/array/flat-map'
import Case from 'case'
import { singularize, pluralize } from 'inflection'
import { ASSOC_TYPES } from '../constants'

const modelVar = name => singularize(Case.pascal(name))
export const modelFileName = name => singularize(Case.kebab(name))
const modelProp = name => singularize(Case.camel(name))
const modelTable = ({ name, snake, singularTableNames }) => {
  const casedName = snake ? Case.snake(name) : Case.camel(name)
  return singularTableNames ? singularize(casedName) : pluralize(casedName)
}
const fieldProp = name => singularize(Case.camel(name))
const dbField = name => singularize(Case.snake(name))

export const files = ({ models = [], config: { name, dialect }, config }) => ({
  name: config.name,
  files: [
    { name: 'package.json', content: packageJson({ name, dialect }) },
    { name: '.gitignore', content: gitignore() },
    { name: 'server.js', content: serverJs() },
    {
      name: 'db',
      files: [
        { name: 'index.js', content: dbTemplate({ models, config }) },
        {
          name: 'models',
          files: models.map(model => modelFile({ model, config }))
        }
      ]
    }
  ]
})

export const modelFile = ({ model, config }) => ({
  name: `${modelFileName(model.name)}.js`,
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
${renderAssocs({ models, config })}

module.exports = {
  sequelize,
  Sequelize${renderModelExports(models)}
}`

const renderModelImports = models =>
  models.length ? models.map(model => renderModelImport(model)).join('') : ''

const renderModelImport = ({ name }) =>
  `const ${modelVar(name)}Model = require('${renderModelPath(name)}');\n`

const renderModelPath = name => `./models/${modelFileName(name)}.js`

const renderAssocs = ({ models, config }) =>
  models.some(model => model.assocs.length > 0)
    ? models
      .flatMap(model =>
        console.log(model) || model.assocs.map(assoc => {
          const target = models.find(m => m.id === assoc.modelId)
          return renderAssoc(assoc, model, target, config)
        })
      )
      .join('')
    : ''

const renderAssoc = (assoc, model, target, config) =>
  `${modelVar(model.name)}.${assocMethod(assoc.type)}(${
    target.name
  }${renderAssocOpts(assoc, model, target, config)});\n`

const assocMethod = type => {
  switch (type) {
    case ASSOC_TYPES.BELONGS_TO:
      return 'belongsTo'
    case ASSOC_TYPES.HAS_ONE:
      return 'hasOne'
    case ASSOC_TYPES.HAS_MANY:
      return 'hasMany'
    case ASSOC_TYPES.MANY_TO_MANY:
      return 'belongsToMany'
  }
}

const renderAssocOpts = (assoc, model, target, config) =>
  assoc.as || assoc.foreignKey || assoc.type === ASSOC_TYPES.MANY_TO_MANY
    ? `, {\n  ${kvs(
      [
        {
          k: 'through',
          v: `'${modelTable({
            name: assoc.through,
            snake: config.snake,
            singularTableNames: config.singularTableNames
          })}'`,
          exclude: assoc.type !== ASSOC_TYPES.MANY_TO_MANY
        },
        {
          k: 'foreignKey',
          v: `'${modelTable({
            name: assoc.foreignKey || assoc.as + ' id',
            snake: config.snake,
            singularTableNames: true
          })}'`,
          exclude: !assoc.foreignKey && !(assoc.as && config.snake)
        },
        {
          k: 'otherKey',
          v: `'${assoc.targetForeignKey}'`,
          exclude:
              assoc.type !== ASSOC_TYPES.MANY_TO_MANY ||
              !assoc.targetForeignKey
        },
        { k: 'as', v: `'${Case.camel(assoc.as)}'`, exclude: !assoc.as }
      ],
      2
    )}\n}`
    : ''

const renderModelDefs = models =>
  models.length
    ? '\n' + models.map(model => renderModelDef(model)).join('')
    : ''

const renderModelDef = ({ name }) =>
  `const ${modelVar(name)} = ${modelVar(name)}Model(sequelize, Sequelize);\n`

const renderModelExports = models =>
  models.length
    ? ',\n  ' + models.map(({ name }) => modelVar(name)).join(',\n  ')
    : ''

const renderConstructor = ({
  dialect = 'sqlite',
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
      { k: 'store', v: `':memory'`, exclude: dialect !== 'sqlite' },
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
      { k: 'underscoredAll', v: snake, exclude: !snake },
      { k: 'timestamps', v: timestamps, exclude: timestamps },
      { k: 'paranoid', v: softDeletes, exclude: !softDeletes }
    ],
    4
  )

// Model

const modelTemplate = ({ model: { name, fields = [] }, config = {} }) =>
  `'use strict';

module.exports = (sequelize, DataTypes) => {
  const ${modelVar(name)} = sequelize.define('${modelProp(name)}', {
    ${renderFields(fields, config)}
  }${renderModelOpts({ name, config })});

  return ${modelVar(name)};
};
`

const renderFields = (fields, config) =>
  fields
    .map(field => renderField(field, config))
    .concat(renderTimestampFields(config))
    .join(',\n    ')

const renderField = (field, config) => `${fieldProp(field.name)}: {
      ${renderFieldKvs(field, config)}
    }`

const renderTimestampFields = ({ snake, timestamps, softDeletes }) => {
  const fields = [
    { name: 'createdAt', exclude: !snake || !timestamps },
    { name: 'updatedAt', exclude: !snake || !timestamps },
    { name: 'deletedAt', exclude: !snake || !softDeletes }
  ]

  return fields
    .filter(({ exclude }) => !exclude)
    .map(({ name }) => renderTimeStampKvs(name))
}

const renderTimeStampKvs = name => `${fieldProp(name)}: {
      ${kvs(
    [
      { k: 'type', v: 'DataTypes.DATE' },
      { k: 'field', v: `'${dbField(name)}'` }
    ],
    6
  )}
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
      { k: 'field', v: `'${dbField(name)}'`, exclude: !snake }
    ],
    6
  )
const renderModelOpts = ({ name, config: { snake, singularTableNames } }) =>
  snake || singularTableNames
    ? `, { tableName: '${modelTable({ name, snake, singularTableNames })}' }`
    : ''

const kvs = (kvs, depth = 0, singleLine = false) =>
  kvs
    .filter(kv => !kv.exclude)
    .map(({ k, v }) => `${k}: ${v}`)
    .join(`,${singleLine ? ' ' : `\n${indent(depth)}`}`)

const indent = depth => new Array(depth).fill(' ').join('')

const serverJs = () =>
  `const db = require('./db');
 db
   .sequelize
   .sync({ force: true })
   .then(() => console.log('done'))\n`

const packageJson = ({ name, dialect }) =>
  `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    ${renderDeps(dialect)}
  }
}\n`

const drivers = {
  postgres: [
    { name: 'pg', version: '7.9.0' },
    { name: 'pg-hstore', version: '2.3.2' }
  ],
  mysql: [{ name: 'mysql2', version: '1.6.5' }],
  mariadb: [{ name: 'mariadb', version: '2.0.3' }],
  sqlite: [{ name: 'sqlite3', version: '4.0.6' }],
  mssql: [{ name: 'tedious', version: '5.0.3' }]
}

const renderDeps = dialect => `${renderDepsKvs(drivers[dialect] || [])}`

const renderDepsKvs = drivers =>
  kvs(
    [
      { k: `"sequelize"`, v: `"^4.43.0"` },
      ...drivers.map(({ name, version }) => ({
        k: `"${name}"`,
        v: `"^${version}"`
      }))
    ],
    4
  )

const gitignore = () =>
  `# Created by https://www.gitignore.io/api/node
# Edit at https://www.gitignore.io/?templates=node

### Node ###
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# TypeScript v1 declaration files
typings/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# End of https://www.gitignore.io/api/node`
