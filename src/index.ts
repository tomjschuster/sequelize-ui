import { SqlDialect, DatabaseOptions } from './database'
import { AssociationType, DataTypeType, Model, Schema, ThroughType } from './schema'
import { generateSequelizeProject } from './codegen/sequelize/project'
import { createZip } from './files'
import fs from 'fs'
import path from 'path'
/*
  TODO:
    - Default values
*/

// const options: DatabaseOptions = {
//   sqlDialect: SqlDialect.Postgres,
//   timestamps: true,
//   caseStyle: 'camel',
//   nounForm: 'plural',
// }

// const postOffice: Model = {
//   id: '1',
//   name: 'Post',
//   fields: [
//     { name: 'id', type: { type: DataTypeType.Integer }, primaryKey: true },
//     { name: 'other id', type: { type: DataTypeType.Integer }, primaryKey: true, unique: true },
//     { name: 'title', type: { type: DataTypeType.String }, required: true, unique: true },
//     { name: 'content', type: { type: DataTypeType.Text } },
//     {
//       name: 'foo',
//       type: { type: DataTypeType.Array, arrayType: { type: DataTypeType.Float } },
//       required: false,
//       unique: false,
//     },
//     {
//       name: 'bar',
//       type: { type: DataTypeType.Enum, values: ['hello', 'world'] },
//       required: false,
//       unique: false,
//     },
//   ],
//   associations: [
//     { type: AssociationType.BelongsTo, alias: 'author', targetModelId: '2' },
//     { type: AssociationType.HasMany, targetModelId: '2' },
//     { type: AssociationType.HasOne, alias: 'parent', targetModelId: '1' },
//     { type: AssociationType.HasOne, alias: 'best', targetModelId: '3' },
//     { type: AssociationType.HasMany, targetModelId: '4' },
//     { type: AssociationType.HasMany, targetModelId: '5' },
//   ],
// }

// const user: Model = {
//   id: '2',
//   name: 'User',
//   fields: [],
//   associations: [],
// }

// const comment: Model = {
//   id: '3',
//   name: 'Comment',
//   fields: [],
//   associations: [],
// }

// const deer: Model = {
//   id: '4',
//   name: 'Deer',
//   fields: [],
//   associations: [],
// }

// const otherThing: Model = {
//   id: '5',
//   name: 'otherThing',
//   fields: [],
//   associations: [],
// }

// const schema: Schema = {
//   id: '1',
//   name: 'Schema',
//   models: [postOffice, user, comment, deer, otherThing],
// }

// console.log(generateSequelizeProject({ schema, options }))

// const film: Model = {
//   id: '6',
//   name: 'film',
//   fields: [
//     {
//       name: 'filmId',
//       type: { type: DataTypeType.Integer, autoincrement: true },
//       primaryKey: true,
//       required: true,
//     },
//     { name: 'name', type: { type: DataTypeType.String }, required: true },
//     { name: 'lastUpdate', type: { type: DataTypeType.DateTime }, required: true },
//   ],
//   associations: [
//     { type: AssociationType.HasOne, targetModelId: '7', alias: 'cat' },
//     { type: AssociationType.HasMany, targetModelId: '8', foreignKey: 'blabla' },
//     {
//       type: AssociationType.ManyToMany,
//       targetModelId: '7',
//       // through: { type: ThroughType.ThroughModel, modelId: '8' },
//       through: { type: ThroughType.ThroughModel, modelId: '8' },
//       alias: 'cats',
//     },
//   ],
// }

// const category: Model = {
//   id: '7',
//   name: 'category',
//   fields: [],
//   associations: [],
// }

// const filmCategory: Model = {
//   id: '8',
//   name: 'film_category',
//   fields: [],
//   associations: [],
// }

// const dvdSchema: Schema = {
//   id: '2',
//   name: 'dvd',
//   models: [category, film, filmCategory],
// }

// console.log(
//   generateSequelizeProject({ schema: dvdSchema, options }),
//   generateSequelizeProject({ schema: dvdSchema, options }).files.find((x) => x.name === 'models'),
// )

// createZip(generateSequelizeProject({ schema: dvdSchema, options })).then((buffer) =>
//   fs.writeFileSync(path.join(__dirname, 'project.zip'), buffer),
// )

const actor: Model = {
  id: '1',
  name: 'actor',
  fields: [
    {
      name: 'actorId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'firstName',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'lastName',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    { type: AssociationType.HasMany, targetModelId: '2' },
    {
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: '2' },
      targetModelId: '3',
    },
  ],
}

const filmActor: Model = {
  id: '2',
  name: 'film actor',
  fields: [],
  associations: [
    { type: AssociationType.BelongsTo, targetModelId: '1' },
    { type: AssociationType.BelongsTo, targetModelId: '3' },
  ],
}

const film: Model = {
  id: '3',
  name: 'film',
  fields: [
    {
      name: 'filmId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'title',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'description',
      type: { type: DataTypeType.String },
    },
    {
      name: 'releaseYear',
      type: { type: DataTypeType.Integer },
    },
    {
      name: 'rating',
      type: { type: DataTypeType.Enum, values: ['G', 'PG', 'PG-13', 'R', 'NC-17'] },
    },
    {
      name: 'specialFeatures',
      type: { type: DataTypeType.Array, arrayType: { type: DataTypeType.String } },
    },
  ],
  associations: [
    { type: AssociationType.HasMany, targetModelId: '2' },
    {
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: '2' },
      targetModelId: '1',
    },
    { type: AssociationType.HasMany, targetModelId: '4' },
    {
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: '4' },
      targetModelId: '5',
    },
    {
      type: AssociationType.BelongsTo,
      targetModelId: '6',
    },
    { type: AssociationType.HasMany, targetModelId: '7' },
  ],
}

const filmCategory: Model = {
  id: '4',
  name: 'film category',
  fields: [],
  associations: [
    { type: AssociationType.BelongsTo, targetModelId: '3' },
    { type: AssociationType.BelongsTo, targetModelId: '5' },
  ],
}

const category: Model = {
  id: '5',
  name: 'category',
  fields: [
    {
      name: 'categoryId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'name',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    { type: AssociationType.HasMany, targetModelId: '4' },
    {
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: '4' },
      targetModelId: '3',
    },
  ],
}

const language: Model = {
  id: '6',
  name: 'language',
  fields: [
    {
      name: 'languageId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'name',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [{ type: AssociationType.HasMany, targetModelId: '4' }],
}

const inventory: Model = {
  id: '7',
  name: 'inventory',
  fields: [
    {
      name: 'inventoryId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    { type: AssociationType.BelongsTo, targetModelId: '4' },
    { type: AssociationType.BelongsTo, targetModelId: '8' },
    { type: AssociationType.HasMany, targetModelId: '9' },
  ],
}

const store: Model = {
  id: '8',
  name: 'store',
  fields: [
    {
      name: 'storeId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    { type: AssociationType.HasMany, targetModelId: '7' },
    { type: AssociationType.BelongsTo, targetModelId: '10', foreignKey: 'managerStaffId' },
  ],
}

const rental: Model = {
  id: '9',
  name: 'rental',
  fields: [
    {
      name: 'rentalId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    { type: AssociationType.BelongsTo, targetModelId: '7' },
    { type: AssociationType.BelongsTo, targetModelId: '10' },
  ],
}

const staff: Model = {
  id: '10',
  name: 'staff',
  fields: [
    {
      name: 'staffId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'firstName',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'lastName',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'email',
      type: { type: DataTypeType.String },
    },
  ],
  associations: [
    { type: AssociationType.HasMany, targetModelId: '8', foreignKey: 'managerStaffId' },
    { type: AssociationType.HasMany, targetModelId: '9' },
  ],
}

const customer: Model = {
  id: '11',
  name: 'customer',
  fields: [
    {
      name: 'customerId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'firstName',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'lastName',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'email',
      type: { type: DataTypeType.String },
    },
  ],
  associations: [
    { type: AssociationType.BelongsTo, targetModelId: '8' },
    { type: AssociationType.HasMany, targetModelId: '9' },
  ],
}

const schema: Schema = {
  id: '1',
  name: 'dvd',
  models: [
    film,
    filmActor,
    actor,
    filmCategory,
    category,
    language,
    inventory,
    store,
    rental,
    staff,
    customer,
  ],
}
const options: DatabaseOptions = {
  sqlDialect: SqlDialect.Postgres,
  timestamps: true,
  caseStyle: 'snake',
  nounForm: 'singular',
}

console.log(generateSequelizeProject({ schema, options }))

createZip(generateSequelizeProject({ schema, options })).then((buffer) =>
  fs.writeFileSync(path.join(__dirname, 'project.zip'), buffer),
)
