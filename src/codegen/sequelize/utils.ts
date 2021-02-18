import { pascalCase, singular } from '../../helpers/string'
import { DataTypeType, Field, Model } from '../../schema'
import { plural as plural_ } from '../../helpers/string'

// some association methods have singular and plural forms
// for example: "has many deer" would have addDeer for both adding one or multiple deer
// so we must append an 's' for nouns whose plural is the same as their singular
export const plural = (v: string): string => {
  if (plural_(v) === singular(v)) return `${v}s`
  return plural_(v)
}

export const modelName = ({ name }: Model): string => singular(pascalCase(name))

export const addIdField = (fields: Field[]): Field[] =>
  fields.some((f) => f.primaryKey) ? fields : [idField(), ...fields]

const idField = (): Field => ({
  name: 'id',
  type: { type: DataTypeType.Integer },
  primaryKey: true,
})

export const hasJsonType = (model: Model): boolean =>
  model.fields.some((f) => f.type.type === DataTypeType.Json)

export const literalFunction = (fn: string): string => `Sequelize.literal('${fn}')`
