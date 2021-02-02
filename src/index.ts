import { dbTemplate } from './codegen/sequelize/templates/db'
import { modelTemplate, ModelTemplateArgs } from './codegen/sequelize/templates/model'
import { initModelsTemplate } from './codegen/sequelize/templates/initModels'
import { SqlDialect, DatabaseOptions } from './database'
import { AssociationType, DataTypeType, Model, Schema, ThroughType } from './schema'

/*
  TODO:
    - Static files
    - Default values
*/

const options: DatabaseOptions = {
  sqlDialect: SqlDialect.MariaDb,
  timestamps: true,
  caseStyle: 'camel',
  nounForm: 'plural',
}

const postOffice: Model = {
  id: '1',
  name: 'Post',
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

const category: Model = {
  id: '6',
  name: 'category',
  fields: [
    {
      name: 'categoryId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    { name: 'name', type: { type: DataTypeType.String }, required: true },
    { name: 'lastUpdate', type: { type: DataTypeType.DateTime }, required: true },
  ],
  associations: [
    { type: AssociationType.HasOne, targetModelId: '8', alias: 'cats' },
    { type: AssociationType.HasMany, targetModelId: '8', foreignKey: 'blabla' },
    {
      type: AssociationType.ManyToMany,
      targetModelId: '7',
      // through: { type: ThroughType.ThroughModel, modelId: '8' },
      through: { type: ThroughType.ThroughTable, table: 'foo' },
      alias: 'cat',
    },
  ],
}

const film: Model = {
  id: '7',
  name: 'film',
  fields: [],
  associations: [],
}

const filmCategory: Model = {
  id: '8',
  name: 'film_category',
  fields: [],
  associations: [],
}

const dvdSchema: Schema = {
  id: '2',
  name: 'dvd',
  models: [category, film, filmCategory],
}
const dvdData: ModelTemplateArgs = {
  model: category,
  schema: dvdSchema,
  options,
}

console.log(modelTemplate(dvdData))

console.log(dbTemplate({ schema: dvdSchema, options }))

console.log(initModelsTemplate({ schema: dvdSchema, options }))
