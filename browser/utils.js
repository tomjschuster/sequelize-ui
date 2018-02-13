import JSZip from 'jszip'
import Case from 'case'
import { saveAs } from 'file-saver'

const modelHeader =
  "const Sequelize = require('sequelize')\nconst db = require('./_db')\n\n"

const printField = field => {
  let output = `  ${Case.camel(field.name)}: {\n    type: Sequelize.${
    field.type
  },\n`

  if (field.allowNull !== undefined) {
    output += `    allowNull: ${field.allowNull},\n`
  }

  if (field.unique !== undefined) {
    output += `    unique: ${
      field.uniqueKey ? `'${field.uniqueKey}'` : field.unique
    },\n`
  }

  if (field.primaryKey !== undefined) {
    output += `    primaryKey: ${field.primaryKey},\n`
  }

  if (field.autoIncrement !== undefined) {
    output += `    autoIncrement: ${field.autoIncrement},\n`
  }

  if (field.defaultValue !== undefined) {
    if (field.type === 'TEXT' || field.type === 'STRING') {
      field.defaultValue = `'${field.defaultValue}'`
    }
    output += `    defaultValue: ${field.defaultValue},\n`
  }

  if (field.comment !== undefined) {
    output += `    comment: '${field.comment}',\n`
  }

  if (field.field !== undefined) {
    output += `    field: '${field.field}',\n`
  }

  if (field.validate) {
    output += '    validate: {\n'

    if (field.validate.is !== undefined) {
      output += `      is: ${field.validate.is},\n`
    }

    if (field.validate.contains !== undefined) {
      output += `      contains: '${field.validate.contains}',\n`
    }

    if (field.validate.min !== undefined) {
      output += `      min: ${field.validate.min},\n`
    }

    if (field.validate.max !== undefined) {
      output += `      max: ${field.validate.max},\n`
    }

    if (field.validate.isEmail !== undefined) {
      output += `      isEmail: ${field.validate.isEmail},\n`
    }

    if (field.validate.isUrl !== undefined) {
      output += `      isUrl: ${field.validate.isUrl},\n`
    }

    output += '    }\n'
  }

  output += `  }`
  return output
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

const makeModelFile = model => {
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

const makeAssociationFile = models => {
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

const _db =
  "const Sequelize = require('sequelize')\n" +
  "const db = new Sequelize('postgres://user:pass@example.com:5432/dbname')\n" +
  'module.exports = db\n'

export const guid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )

export const exportModel = models => {
  const zip = new JSZip()
  zip.file('_db.js', _db)
  zip.file('index.js', makeAssociationFile(models))
  models.forEach(model =>
    zip.file(`${Case.camel(model.name)}.js`, makeModelFile(model))
  )
  return zip
    .generateAsync({ type: 'blob' })
    .then(blob => saveAs(blob, 'db.zip'))
}
