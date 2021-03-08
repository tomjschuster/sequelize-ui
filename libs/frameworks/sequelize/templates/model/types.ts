import {
  blank,
  camelCase,
  DatabaseOptions,
  Field,
  isDateTimeType,
  lines,
  Model,
} from '@sequelize-ui/core'
import { dataTypeToTypeScript } from '../../dataTypes'
import { modelName } from '../../helpers'
import { noSupportedDetails, notSupportedComment } from './common'

type ModelTypesTemplateArgs = {
  model: Model
  dbOptions: DatabaseOptions
}
export const modelTypesTemplate = ({ model, dbOptions }: ModelTypesTemplateArgs): string =>
  lines([
    modelAttributesType({ model, dbOptions }),
    blank(),
    idTypes(model),
    creationAttributeType(model),
  ])

const modelAttributesType = ({ model, dbOptions }: ModelTypesTemplateArgs): string =>
  lines([
    `export interface ${modelName(model)}Attributes {`,
    lines(
      model.fields.map((field) => attributeType(field, dbOptions)),
      { depth: 2 },
    ),
    '}',
  ])

const attributeType = (
  { name, type, required }: Field,
  dbOptions: DatabaseOptions,
): Array<string | null> => {
  const optional = (isDateTimeType(type) && type.defaultNow) || !required
  const comment = notSupportedComment(type, dbOptions.sqlDialect)
  const typeDisplay = dataTypeToTypeScript(type)

  return [
    noSupportedDetails(type, dbOptions.sqlDialect),
    `${comment}${camelCase(name)}${optional ? '?' : ''}: ${typeDisplay}`,
  ]
}

const idTypes = (model: Model): string => {
  const name = modelName(model)
  const pks = model.fields.filter((f) => f.primaryKey)

  if (pks.length === 0) {
    return `export type ${name}Id = number`
  }

  return lines([
    `export type ${name}Pk = ${pks.map((f) => `'${camelCase(f.name)}'`).join(' | ')}`,
    `export type ${name}Id = ${name}Attributes[${name}Pk]`,
  ])
}

const creationAttributeType = (model: Model): string => {
  const name = modelName(model)
  const pks = model.fields.filter((f) => f.primaryKey)

  if (pks.length === 0) {
    return `export type ${name}CreationAttributes = ${name}Attributes & { id?: number }`
  }

  return `export type ${name}CreationAttributes = Optional<${name}Attributes, ${name}Pk>`
}
