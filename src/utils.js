import JSZip from 'jszip'
import Case from 'case'
import { saveAs } from 'file-saver'


const modelHeader =
  "const Sequelize = require('sequelize')\nconst db = require('./_db')\n\n"

const fieldType = field =>
  `  ${Case.camel(field.name)}: {\n    type: Sequelize.${field.type},\n`
const maybeAppendKey = (field, key, output) =>
  field[key] !== undefined ? output + `    ${key}: '${field[key]}',\n` : output

const maybeAppendUnique = (field, output) => {
  if (field.unique !== undefined) {
    return (
      output +
      `    unique: ${
        field.uniqueKey ? `'${field.uniqueKey}'` : field.unique
      },\n`
    )
  } else {
    return output
  }
}

const maybeAppendAllowNull = (field, output) => {
  if (field.defaultValue !== undefined) {
    const defaultValue =
      field.type === 'TEXT' || field.type === 'STRING'
        ? `'${field.defaultValue}'`
        : field.defaultValue

    return output + `    defaultValue: ${defaultValue},\n`
  } else {
    return output
  }
}

const maybeAppendStringValidation = (validate, key, output) =>
  validate[key] !== undefined
    ? output + `      ${key}: '${validate[key]}',\n`
    : output

const maybeAppendValidation = (validate, key, output) =>
  validate[key] !== undefined
    ? output + `      ${key}: ${validate[key]},\n`
    : output

const maybeAppendValidate = (field, output) => {
  if (field.validate) {
    output = output + '    validate: {\n'
    output = maybeAppendStringValidation(field.validate, 'is', output)
    output = maybeAppendStringValidation(field.validate, 'contains', output)
    output = maybeAppendValidation(field.validate, 'min', output)
    output = maybeAppendValidation(field.validate, 'max', output)
    output = maybeAppendStringValidation(field.validate, 'isEmail', output)
    output = maybeAppendStringValidation(field.validate, 'isUrl', output)
    return output + '    }\n'
  } else {
    return output
  }
}

const printField = field => {
  let output = fieldType(field)
  output = maybeAppendKey(field, 'allowNull', output)
  output = maybeAppendUnique(field, output)
  output = maybeAppendKey(field, 'primaryKey', output)
  output = maybeAppendKey(field, 'autoIncrement', output)
  output = maybeAppendAllowNull(field, output)
  output = maybeAppendKey(field, 'comment', output)
  output = maybeAppendKey(field, 'field', output)
  output = maybeAppendValidate(field, output)
  return output + `  }`
}

const printMethods = methods => {
  let output = ''
  for (let key in methods) {
    if (methods[key]) output += `  ${key}: {\n    //Write methods here\n  },\n`
  }
  return output
}

const printConfig = config => {
  let output = ''
  output += config.tableName ? `  tableName: '${config.tableName}',\n` : ''
  if (config.singular && config.plural) {
    output += `  name: { singular: '${config.singular}', plural: '${
      config.plural
    }' },\n`
  } else if (config.singular) {
    output += `  name: { singular: '${config.singular}' },\n`
  } else if (config.plural) {
    output += `  name: { plural: '${config.plural}' },\n`
  }
  output += config.timestamps === false ? '  timestamps: false,\n' : ''
  output += config.freezeTableNames ? '  freezeTableNames: true,\n' : ''
  output += config.underscored ? '  underscored: true,\n' : ''
  output += config.underscoredAll ? '  underscoredAll: true,\n' : ''
  return output
}

const modelContent = model => {
  let output = modelHeader
  output += `const ${Case.pascal(model.name)} = db.define('${Case.snake(
    model.name
  )}', {\n`
  let fields = model.fields.length
    ? model.fields.map(printField).join(',\n')
    : ''
  output += fields
  output += '\n},\n{\n'
  output += printMethods(model.methods)
  output += printConfig(model.config)
  output += '\n})\n\n'
  output += `module.exports = ${Case.pascal(model.name)}\n`
  return output
}
const modelFile = (zip, model) =>
  zip.file(`${Case.camel(model.name)}.js`, modelContent(model))

const associationContent = models => {
  let output = ''
  models.forEach(model => {
    output += `const ${Case.pascal(model.name)} = require('./${model.name}')\n`
  })
  output += '\n'
  const modelNamesObj = models.reduce(
    (acc, model) => ({ ...acc, [model.id]: model.name }),
    {}
  )
  models.filter(model => model.associations.length).forEach(model => {
    model.associations.forEach(association => {
      let { relationship, target, config } = association
      output += `${Case.pascal(model.name)}.${relationship}(${Case.pascal(
        modelNamesObj[target]
      )}`
      let configKeys = Object.keys(config).filter(key => config[key])
      if (configKeys.length) {
        output += ', { '
        output += configKeys.map(key => `${key}: '${config[key]}'`).join(', ')
        output += ' }'
      }
      output += ')\n'
    })
    output += '\n'
  })
  output += `module.exports = {${models
    .map(model => Case.pascal(model.name))
    .join(', ')}}\n`
  return output
}

const associationFile = (zip, models) =>
  zip.file('index.js', associationContent(models))

const dbContent =
  "const Sequelize = require('sequelize')\n" +
  "const db = new Sequelize('postgres://user:pass@example.com:5432/dbname')\n" +
  'module.exports = db\n'

const dbFile = zip => zip.file('_db.js', dbContent)

const toZip = models => {
  const zip = new JSZip()
  dbFile(zip)
  associationFile(zip, models)
  for (let model of models) modelFile(zip, model)
  return zip
}

export const exportModel = models =>
  toZip(models)
    .generateAsync({type: 'blob'})
    .then(blob => saveAs(blob, 'db.zip'))

export const guid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
