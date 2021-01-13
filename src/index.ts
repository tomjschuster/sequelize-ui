import { modelTemplate, ModelTemplateArgs } from './codegen/sequelize/templates/model'
import { AssociationType, DataTypeType } from './schema'

/*
  TODO:
    - Snake case
    - Timestamps
    - Singular table names
    - Other files
*/

const data: ModelTemplateArgs = {
  modelName: 'Post',
  associations: [
    { modelName: 'User', type: AssociationType.BelongsTo, alias: 'author' },
    { modelName: 'Comment', type: AssociationType.HasMany },
    { modelName: 'Post', type: AssociationType.HasOne, alias: 'parent' },
    { modelName: 'Comment', type: AssociationType.HasOne, alias: 'best' },
    { modelName: 'Deer', type: AssociationType.HasMany },
    { modelName: 'OtherThing', type: AssociationType.HasMany },
  ],
  fields: [
    { name: 'id', type: { type: DataTypeType.Integer }, primaryKey: true },
    { name: 'otherId', type: { type: DataTypeType.Integer }, primaryKey: true, unique: true },
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
}

console.log(modelTemplate(data))
