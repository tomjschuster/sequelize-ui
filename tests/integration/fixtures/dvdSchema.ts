import { AssociationTypeType, DataTypeType, Model, Schema, ThroughType } from '@src/core/schema'

const actor: Model = {
  id: '1',
  name: 'actor',
  fields: [
    {
      id: '1',
      name: 'actorId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '2',
      name: 'firstName',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '3',
      name: 'lastName',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: '-1',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: '1',
      targetModelId: '2',
    },
    {
      id: '0',
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: '2' },
      },
      sourceModelId: '1',
      targetModelId: '3',
    },
  ],
}

const filmActor: Model = {
  id: '2',
  name: 'film actor',
  fields: [],
  associations: [
    {
      id: '1',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: '2',
      targetModelId: '1',
    },
    {
      id: '2',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: '2',
      targetModelId: '3',
    },
  ],
}

const film: Model = {
  id: '3',
  name: 'film',
  fields: [
    {
      id: '4',
      name: 'filmId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '5',
      name: 'title',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '6',
      name: 'description',
      type: { type: DataTypeType.String },
    },
    {
      id: '7',
      name: 'releaseYear',
      type: { type: DataTypeType.Integer },
    },
    {
      id: '8',
      name: 'rating',
      type: {
        type: DataTypeType.Enum,
        values: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
      },
    },
    {
      id: '9',
      name: 'specialFeatures',
      type: {
        type: DataTypeType.Array,
        arrayType: { type: DataTypeType.String },
      },
    },
    {
      id: '10',
      name: 'metaData',
      type: { type: DataTypeType.Json },
    },
    {
      id: '11',
      name: 'preview',
      type: { type: DataTypeType.Blob },
    },
  ],
  associations: [
    {
      id: '3',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: '3',
      targetModelId: '2',
    },
    {
      id: '4',
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: '2' },
      },
      sourceModelId: '3',
      targetModelId: '1',
    },
    {
      id: '5',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: '3',
      targetModelId: '4',
    },
    {
      id: '6',
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: '4' },
      },
      sourceModelId: '3',
      targetModelId: '5',
    },
    {
      id: '7',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: '3',
      targetModelId: '6',
    },
    {
      id: '8',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: '3',
      targetModelId: '7',
    },
  ],
}

const filmCategory: Model = {
  id: '4',
  name: 'film category',
  fields: [],
  associations: [
    {
      id: '9',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: '4',
      targetModelId: '3',
    },
    {
      id: '10',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: '4',
      targetModelId: '5',
    },
  ],
}

const category: Model = {
  id: '5',
  name: 'category',
  fields: [
    {
      id: '12',
      name: 'categoryId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '13',
      name: 'name',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: '11',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: '5',
      targetModelId: '4',
    },
    {
      id: '12',
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: '4' },
      },
      sourceModelId: '5',
      targetModelId: '3',
    },
  ],
}

const language: Model = {
  id: '6',
  name: 'language',
  fields: [
    {
      id: '14',
      name: 'languageId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '15',
      name: 'name',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: '13',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: '6',
      targetModelId: '4',
    },
  ],
}

const inventory: Model = {
  id: '7',
  name: 'inventory',
  fields: [
    {
      id: '16',
      name: 'inventoryId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: '14',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: '7',
      targetModelId: '4',
    },
    {
      id: '15',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: '7',
      targetModelId: '8',
    },
    {
      id: '16',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: '7',
      targetModelId: '9',
    },
  ],
}

const store: Model = {
  id: '8',
  name: 'store',
  fields: [
    {
      id: '17',
      name: 'storeId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: '17',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: '8',
      targetModelId: '7',
    },
    {
      id: '18',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: '8',
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
      id: '18',
      name: 'rentalId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '19',
      name: 'rentedAt',
      type: { type: DataTypeType.DateTime, defaultNow: true },
      required: true,
    },
  ],
  associations: [
    {
      id: '19',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: '9',
      targetModelId: '7',
    },
    {
      id: '20',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: '9',
      targetModelId: '10',
    },
  ],
}

const staff: Model = {
  id: '10',
  name: 'staff',
  fields: [
    {
      id: '20',
      name: 'staffId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '21',
      name: 'firstName',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '22',
      name: 'lastName',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '23',
      name: 'email',
      type: { type: DataTypeType.String },
    },
  ],
  associations: [
    {
      id: '21',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: '10',
      targetModelId: '8',
      foreignKey: 'managerStaffId',
    },
    {
      id: '22',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: '10',
      targetModelId: '9',
    },
  ],
}

const customer: Model = {
  id: '11',
  name: 'customer',
  fields: [
    {
      id: '24',
      name: 'customerId',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '25',
      name: 'firstName',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '26',
      name: 'lastName',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '27',
      name: 'email',
      type: { type: DataTypeType.String },
    },
  ],
  associations: [
    {
      id: '23',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: '11',
      targetModelId: '8',
    },
    {
      id: '24',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: '11',
      targetModelId: '9',
    },
  ],
}

export const dvdSchema = (name: string): Schema => ({
  id: '1',
  name,
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
})
