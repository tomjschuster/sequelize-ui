import { blank, lines } from '@src/core/codegen'
import { DbOptions } from '@src/core/database'
import { Field, isDateTimeType, Model } from '@src/core/schema'
import { camelCase } from '@src/utils/string'
import { dataTypeToTypeScript } from '../../utils/dataTypes'
import { pkIsDefault } from '../../utils/helpers'
import { modelName } from '../../utils/model'
import { noSupportedDetails, notSupportedComment } from './common'

type ModelTypesTemplateArgs = {
  model: Model
  dbOptions: DbOptions
}
export function modelTypesTemplate({ model, dbOptions }: ModelTypesTemplateArgs): string {
  return lines([
    modelAttributesType({ model, dbOptions }),
    blank(),
    idTypes(model),
    creationAttributeType(model),
  ])
}

function modelAttributesType({ model, dbOptions }: ModelTypesTemplateArgs): string {
  return lines([
    `export interface ${modelName(model)}Attributes {`,
    lines(
      model.fields.filter((f) => !pkIsDefault(f)).map((field) => attributeType(field, dbOptions)),
      { depth: 2 },
    ),
    '}',
  ])
}

function attributeType(
  { name, type, required }: Field,
  dbOptions: DbOptions,
): Array<string | null> {
  const optional = (isDateTimeType(type) && type.defaultNow) || !required
  const comment = notSupportedComment(type, dbOptions.sqlDialect)
  const typeDisplay = dataTypeToTypeScript(type)

  return [
    noSupportedDetails(type, dbOptions.sqlDialect),
    `${comment}${camelCase(name)}${optional ? '?' : ''}: ${typeDisplay}`,
  ]
}

function idTypes(model: Model): string {
  const name = modelName(model)
  const pks = model.fields.filter((f) => f.primaryKey && !pkIsDefault(f))

  if (pks.length === 0) {
    return `export type ${name}Id = number`
  }

  return lines([
    `export type ${name}Pk = ${pks.map((f) => `'${camelCase(f.name)}'`).join(' | ')}`,
    `export type ${name}Id = ${name}Attributes[${name}Pk]`,
  ])
}

function creationAttributeType(model: Model): string {
  const name = modelName(model)
  const pks = model.fields.filter((f) => f.primaryKey && !pkIsDefault(f))

  if (pks.length === 0) {
    return `export type ${name}CreationAttributes = ${name}Attributes & { id?: number }`
  }

  return `export type ${name}CreationAttributes = Optional<${name}Attributes, ${name}Pk>`
}
