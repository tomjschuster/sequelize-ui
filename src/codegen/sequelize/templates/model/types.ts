import { camelCase } from '../../../../helpers/string'
import { dataTypeToTypeScript } from '../../dataTypes'
import { Field, isDateTimeType, Model } from '../../../../schema'
import { blank, lines } from '../../../helpers'
import { DatabaseOptions } from '../../../../database'

import { modelName } from '../../utils'

import { notSupportedComment, noSupportedDetails } from './common'

type ModelTypesTemplateArgs = {
  model: Model
  options: DatabaseOptions
}
export const modelTypesTemplate = ({ model, options }: ModelTypesTemplateArgs): string =>
  lines([
    modelAttributesType({ model, options }),
    blank(),
    idTypes(model),
    creationAttributeType(model),
  ])

const modelAttributesType = ({ model, options }: ModelTypesTemplateArgs): string =>
  lines([
    `export interface ${modelName(model)}Attributes {`,
    lines(
      model.fields.map((field) => attributeType(field, options)),
      { depth: 2 },
    ),
    '}',
  ])

const attributeType = (
  { name, type, required }: Field,
  options: DatabaseOptions,
): Array<string | null> => {
  const optional = (isDateTimeType(type) && type.defaultNow) || !required
  const comment = notSupportedComment(type, options.sqlDialect)
  const typeDisplay = dataTypeToTypeScript(type)

  return [
    noSupportedDetails(type, options.sqlDialect),
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
