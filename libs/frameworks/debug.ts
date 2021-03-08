import {
  AssociationType,
  DatabaseOptions,
  DataTypeType,
  Model,
  Schema,
  SqlDialect,
  ThroughType,
} from '@sequelize-ui/core'
import { SequelizeFramework } from '.'

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
      type: {
        type: DataTypeType.Enum,
        values: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
      },
    },
    {
      name: 'specialFeatures',
      type: {
        type: DataTypeType.Array,
        arrayType: { type: DataTypeType.String },
      },
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
    {
      type: AssociationType.BelongsTo,
      targetModelId: '10',
      foreignKey: 'managerStaffId',
    },
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
    {
      type: AssociationType.HasMany,
      targetModelId: '8',
      foreignKey: 'managerStaffId',
    },
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
const dbOptions: DatabaseOptions = {
  sqlDialect: SqlDialect.Postgres,
  timestamps: true,
  caseStyle: 'snake',
  nounForm: 'singular',
}

const project = SequelizeFramework.generate({ schema, dbOptions })
console.log(project.files.find((f) => f.name === 'models'))
console.log(project)
