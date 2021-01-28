import { modelTemplate, ModelTemplateArgs } from './codegen/sequelize/templates/model'
import { AssociationType, DataTypeType, Model, Schema, SchemaOptions } from './schema'

/*
  TODO:
    - Snake case
    - Timestamps
    - Singular table names
    - Other files
*/

const options: SchemaOptions = {
  timestamps: true,
  caseStyle: 'camel',
  nounForm: 'singular',
}

const postOffice: Model = {
  id: '1',
  name: 'Post Office',
  fields: [
    { name: 'id', type: { type: DataTypeType.Integer }, primaryKey: true },
    { name: 'other id', type: { type: DataTypeType.Integer }, primaryKey: true, unique: true },
    { name: 'title', type: { type: DataTypeType.String }, required: true, unique: true },
    { name: 'content', type: { type: DataTypeType.Text } },
    {
      name: 'foo',
      type: { type: DataTypeType.Array, arrayType: { type: DataTypeType.Float } },
      required: false,
      unique: false,
    },
    {
      name: 'bar',
      type: { type: DataTypeType.Enum, values: ['hello', 'world'] },
      required: false,
      unique: false,
    },
  ],
  associations: [
    { type: AssociationType.BelongsTo, alias: 'author', targetModelId: '2' },
    { type: AssociationType.HasMany, targetModelId: '2' },
    { type: AssociationType.HasOne, alias: 'parent', targetModelId: '1' },
    { type: AssociationType.HasOne, alias: 'best', targetModelId: '3' },
    { type: AssociationType.HasMany, targetModelId: '4' },
    { type: AssociationType.HasMany, targetModelId: '5' },
  ],
}

const user: Model = {
  id: '2',
  name: 'User',
  fields: [],
  associations: [],
}

const comment: Model = {
  id: '3',
  name: 'Comment',
  fields: [],
  associations: [],
}

const deer: Model = {
  id: '4',
  name: 'Deer',
  fields: [],
  associations: [],
}

const otherThing: Model = {
  id: '5',
  name: 'otherThing',
  fields: [],
  associations: [],
}

const schema: Schema = {
  id: '1',
  name: 'Schema',
  models: [postOffice, user, comment, deer, otherThing],
}

const data: ModelTemplateArgs = {
  model: postOffice,
  schema,
  options,
}

console.log(modelTemplate(data))
