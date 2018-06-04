import Case from 'case'
import { OPTIONS, METHODS, optionKey, displayMethod, methodKey, relationshipKey } from './constants'

// Serialization Helpers
const declare = (k, v) => `const ${k} = ${v}`
const statementList = statements => statements.map(x => x + ';').join('')
const moduleExports = v => `module.exports = ${v}`
const array = xs => `[${xs.join()}]`
const kv = (k, v) => `${k}: ${v}`
const object = kvs => `{${kvs.filter(([k, v, f]) => f).map(([k, v]) => kv(k, v)).join(',')}}`
const call = (name, ...args) => `${name}(${args.filter(([_, x]) => x).map(([x]) => x).join()})`
const string = x => typeof x === 'string' ? `'${x}'` : x
const lineBreak = '\n\n'

// DB File
export const dbFile = statementList([
  declare('Sequelize', `require('sequelize')`),
  declare('db', `new Sequelize('postgres://user:pass@example.com:5432/dbname')`),
  lineBreak,
  moduleExports('db')
])

// Model File
// Fields Object
const fieldObj = field => object([
  ['type', `Sequelize.${field.type}`, true],
  ['primaryKey', field.primaryKey, field.primaryKey],
  ['allowNull', field.allowNull, field.allowNull !== undefined],
  ['unique', field.unique, field.unique],
  ['autoIncrement', field.autoIncrement, field.autoIncrement],
  [
    'defaultValue',
    field.type === 'STRING' || field.type === 'TEXT' ? string(field.default) : field.default,
    field.default !== undefined
  ],
  ['comment', string(field.comment), field.comment],
  ['field', string(field.field), field.field]
])

// Config Object
const optionKv = (option, options) => {
  if (option === OPTIONS.NAME) {
    return [
      'name',
      object([
        optionKv(OPTIONS.SINGULAR, options),
        optionKv(OPTIONS.PLURAL, options)
      ]),
      options[OPTIONS.SINGULAR] || options[OPTIONS.PLURAL]
    ]
  } else {
    return [optionKey(option), string(options[option]), options[option]]
  }
}

const options = [
  OPTIONS.TABLE_NAME,
  OPTIONS.NAME,
  OPTIONS.FREEZE_TABLE_NAMES,
  OPTIONS.UNDERSCORED_COLUMNS,
  OPTIONS.UNDERSCORED_TABLE_NAME
]

const methodKv = (method, methods) => ([
  methodKey(method),
  `{\n// Write ${displayMethod(method)} Here\n}`,
  methods[method]
])

const methods = [
  METHODS.HOOKS,
  METHODS.GETTER_METHODS,
  METHODS.SETTER_METHODS
]

// Model Def

const modelDef = model =>
  declare(
    Case.pascal(model.name),
    call(
      'db.define',
      [`'${Case.snake(model.name)}'`, true],
      [object(model.fields.map(x => [Case.camel(x.name), fieldObj(x), true])), true],
      [
        object([
          ...options.map(option => optionKv(option, model.config)),
          ...methods.map(method => methodKv(method, model.methods))
        ]),
        true
      ]
    )
  )

export const modelFile = model => statementList([
  declare('Sequelize', `require('sequelize')`),
  declare('db', `require('./_db')`),
  lineBreak,
  modelDef(model),
  lineBreak,
  moduleExports(Case.pascal(model.name))
])

// Associations File

const modelAssociations = ({ name, associations }, modelNamesById) =>
  associations.map(({ relationship, target, config }) =>
    call(
      `${Case.pascal(name)}.${relationshipKey(relationship)}`,
      [`${Case.pascal(modelNamesById[target])}`, true],
      [
        object(Object.entries(config).map(([k, v]) => ([k, string(v), true]))),
        Object.keys(config).length > 0
      ]
    )
  )

const flattenAssociations = models => {
  const modelNamesById = models.reduce((acc, { id, name }) => ({ ...acc, [id]: name}), {})
  return models.reduce((acc, model) =>
    model.associations.length
      ? acc.concat(...modelAssociations(model, modelNamesById))
      : acc
    , [])
}

export const associationFile = models => statementList([
  ...models.map(({ name }) => declare(Case.pascal(name), `require('./${Case.snake(name)}')`)),
  lineBreak,
  ...flattenAssociations(models),
  lineBreak,
  moduleExports(`{ ${models.map(({ name }) => Case.pascal(name)).join()} }`)
])
