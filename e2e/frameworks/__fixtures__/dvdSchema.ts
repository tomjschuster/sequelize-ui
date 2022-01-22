import {
  arrayDataType,
  belongsToType,
  blobDataType,
  enumDataType,
  hasManyType,
  integerDataType,
  jsonDataType,
  manyToManyModelType,
  Model,
  Schema,
  stringDataType,
  timeDataType,
} from '@src/core/schema'
import { now } from '@src/utils/dateTime'

const time = now()

const actor: Model = {
  id: '1',
  name: 'actor',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '1',
      name: 'actorId',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: '2',
      name: 'firstName',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: '3',
      name: 'lastName',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: '-1',
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: '1',
      targetModelId: '2',
    },
    {
      id: '0',
      alias: null,
      foreignKey: null,
      type: manyToManyModelType('2'),
      sourceModelId: '1',
      targetModelId: '3',
    },
  ],
}

const filmActor: Model = {
  id: '2',
  name: 'film actor',
  createdAt: time,
  updatedAt: time,
  fields: [],
  associations: [
    {
      id: '1',
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: '2',
      targetModelId: '1',
    },
    {
      id: '2',
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: '2',
      targetModelId: '3',
    },
  ],
}

const film: Model = {
  id: '3',
  name: 'film',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '4',
      name: 'filmId',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: '5',
      name: 'title',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: '6',
      name: 'description',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: '7',
      name: 'releaseYear',
      type: integerDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: '8',
      name: 'rating',
      type: enumDataType({
        values: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
      }),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: '9',
      name: 'specialFeatures',
      type: arrayDataType({
        arrayType: stringDataType(),
      }),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: '10',
      name: 'metaData',
      type: jsonDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: '11',
      name: 'preview',
      type: blobDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: '3',
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: '3',
      targetModelId: '2',
    },
    {
      id: '4',
      alias: null,
      foreignKey: null,
      type: manyToManyModelType('2'),
      sourceModelId: '3',
      targetModelId: '1',
    },
    {
      id: '5',
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: '3',
      targetModelId: '4',
    },
    {
      id: '6',
      alias: null,
      foreignKey: null,
      type: manyToManyModelType('4'),
      sourceModelId: '3',
      targetModelId: '5',
    },
    {
      id: '7',
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: '3',
      targetModelId: '6',
    },
    {
      id: '8',
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: '3',
      targetModelId: '7',
    },
  ],
}

const filmCategory: Model = {
  id: '4',
  name: 'film category',
  createdAt: time,
  updatedAt: time,
  fields: [],
  associations: [
    {
      id: '9',
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: '4',
      targetModelId: '3',
    },
    {
      id: '10',
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: '4',
      targetModelId: '5',
    },
  ],
}

const category: Model = {
  id: '5',
  name: 'category',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '12',
      name: 'categoryId',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: '13',
      name: 'name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: '11',
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: '5',
      targetModelId: '4',
    },
    {
      id: '12',
      alias: null,
      foreignKey: null,
      type: manyToManyModelType('4'),
      sourceModelId: '5',
      targetModelId: '3',
    },
  ],
}

const language: Model = {
  id: '6',
  name: 'language',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '14',
      name: 'languageId',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: '15',
      name: 'name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: '13',
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: '6',
      targetModelId: '4',
    },
  ],
}

const inventory: Model = {
  id: '7',
  name: 'inventory',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '16',
      name: 'inventoryId',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: '14',
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: '7',
      targetModelId: '4',
    },
    {
      id: '15',
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: '7',
      targetModelId: '8',
    },
    {
      id: '16',
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: '7',
      targetModelId: '9',
    },
  ],
}

const store: Model = {
  id: '8',
  name: 'store',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '17',
      name: 'storeId',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: '17',
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: '8',
      targetModelId: '7',
    },
    {
      id: '18',
      alias: null,
      foreignKey: 'managerStaffId',
      type: belongsToType(),
      sourceModelId: '8',
      targetModelId: '10',
    },
  ],
}

const rental: Model = {
  id: '9',
  name: 'rental',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '18',
      name: 'rentalId',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: '19',
      name: 'rentedAt',
      type: timeDataType({ defaultNow: true }),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: '19',
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: '9',
      targetModelId: '7',
    },
    {
      id: '20',
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: '9',
      targetModelId: '10',
    },
  ],
}

const staff: Model = {
  id: '10',
  name: 'staff',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '20',
      name: 'staffId',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: '21',
      name: 'firstName',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: '22',
      name: 'lastName',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: '23',
      name: 'email',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: '21',
      alias: null,
      foreignKey: 'managerStaffId',
      type: hasManyType(),
      sourceModelId: '10',
      targetModelId: '8',
    },
    {
      id: '22',
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: '10',
      targetModelId: '9',
    },
  ],
}

const customer: Model = {
  id: '11',
  name: 'customer',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '24',
      name: 'customerId',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
      unique: false,
    },
    {
      id: '25',
      name: 'firstName',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: '26',
      name: 'lastName',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: '27',
      name: 'email',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: '23',
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: '11',
      targetModelId: '8',
    },
    {
      id: '24',
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: '11',
      targetModelId: '9',
    },
  ],
}

export function dvdSchema(name: string): Schema {
  return {
    id: '1',
    name,
    createdAt: time,
    updatedAt: time,
    forkedFrom: null,
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
}
