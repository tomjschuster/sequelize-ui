import { AssociationType, DataTypeType, Model, Schema, ThroughType } from '@lib/core'

enum Id {
  Actor = '1',
  Address = '2',
  Category = '3',
  City = '4',
  Country = '5',
  Customer = '6',
  Film = '7',
  FilmActor = '8',
  FilmCategory = '9',
  FilmText = '10',
  Inventory = '11',
  Language = '12',
  Payment = '13',
  Rental = '14',
  Staff = '15',
  Store = '16',
}

const actor: Model = {
  id: Id.Actor,
  name: 'actor',
  fields: [
    {
      id: '1',
      name: 'actor_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '2',
      name: 'first_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '3',
      name: 'last_name',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: '-20',
      foreignKey: 'actor_id',
      targetFk: 'film_id',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.FilmActor },
      targetModelId: Id.Film,
    },
  ],
}

const film: Model = {
  id: Id.Film,
  name: 'film',
  fields: [
    {
      id: '4',
      name: 'film_id',
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
      name: 'release_year',
      type: { type: DataTypeType.Integer },
    },
    {
      id: '8',
      name: 'language_id',
      type: { type: DataTypeType.Integer },
      required: true,
    },
    {
      id: '9',
      name: 'original_language_id',
      type: { type: DataTypeType.Integer },
    },
    {
      id: '10',
      name: 'rental_duration',
      type: { type: DataTypeType.Integer },
      required: true,
    },
    {
      id: '11',
      name: 'rental_rate',
      type: { type: DataTypeType.Decimal },
      required: true,
    },
    {
      id: '12',
      name: 'length',
      type: { type: DataTypeType.Integer },
    },
    {
      id: '13',
      name: 'rating',
      type: { type: DataTypeType.Enum, values: ['G', 'PG', 'PG-13', 'R', 'NC-17'] },
      required: true,
    },
    {
      id: '14',
      name: 'special_feature',
      type: {
        type: DataTypeType.Array,
        arrayType: {
          type: DataTypeType.Enum,
          values: ['Trailers', 'Commentaries', 'Deleted Scenes', 'Behind the Scenes'],
        },
      },
      required: true,
    },
  ],
  associations: [
    {
      id: '-19',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Language,
    },
    {
      id: '-18',
      alias: 'original_language',
      foreignKey: 'original_language_id',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Language,
    },
    {
      id: '-17',
      foreignKey: 'film_id',
      type: AssociationType.HasMany,
      targetModelId: Id.Inventory,
    },
    {
      id: '-16',
      foreignKey: 'film_id',
      targetFk: 'actor_id',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.FilmActor },
      targetModelId: Id.Actor,
    },
    {
      id: '-15',
      foreignKey: 'film_id',
      targetFk: 'category_id',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.FilmCategory },
      targetModelId: Id.Category,
    },
  ],
}

const language: Model = {
  id: Id.Language,
  name: 'language',
  fields: [
    {
      id: '15',
      name: 'language_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: '-14',
      type: AssociationType.HasMany,
      targetModelId: Id.Film,
    },
    {
      id: '-13',
      alias: 'original_language_film',
      foreignKey: 'original_language_id',
      type: AssociationType.HasMany,
      targetModelId: Id.Film,
    },
  ],
}

const category: Model = {
  id: Id.Category,
  name: 'category',
  fields: [
    {
      id: '16',
      name: 'category_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: '-12',
      foreignKey: 'category_id',
      targetFk: 'film_id',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.FilmCategory },
      targetModelId: Id.Film,
    },
  ],
}

const inventory: Model = {
  id: Id.Inventory,
  name: 'inventory',
  fields: [
    {
      id: '17',
      name: 'inventory_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: '-11',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Film,
    },
    {
      id: '-10',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Store,
    },
  ],
}

const store: Model = {
  id: Id.Store,
  name: 'store',
  fields: [
    {
      id: '18',
      name: 'store_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: '-9',
      type: AssociationType.HasMany,
      targetModelId: Id.Inventory,
    },
    {
      id: '-8',
      type: AssociationType.HasMany,
      targetModelId: Id.Staff,
    },
    {
      id: '-7',
      type: AssociationType.HasMany,
      targetModelId: Id.Customer,
    },
    {
      id: '-6',
      alias: 'manager',
      foreignKey: 'manager_staff_id',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Staff,
    },
    {
      id: '-5',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Address,
    },
  ],
}

const staff: Model = {
  id: Id.Staff,
  name: 'staff',
  fields: [
    {
      id: '19',
      name: 'staff_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '20',
      name: 'first_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '21',
      name: 'last_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '22',
      name: 'picture',
      type: { type: DataTypeType.Blob },
    },
    {
      id: '23',
      name: 'email',
      type: { type: DataTypeType.String },
    },
    {
      id: '24',
      name: 'active',
      type: { type: DataTypeType.Boolean },
      required: true,
    },
    {
      id: '25',
      name: 'username',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '26',
      name: 'password',
      type: { type: DataTypeType.String },
    },
  ],
  associations: [
    {
      id: '-4',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Store,
    },
    {
      id: '-3',
      alias: 'managed_store',
      foreignKey: 'manager_staff_id',
      type: AssociationType.HasMany,
      targetModelId: Id.Store,
    },
    {
      id: '-2',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Address,
    },
    {
      id: '1',
      type: AssociationType.HasMany,
      targetModelId: Id.Rental,
    },
    {
      id: '0',
      type: AssociationType.HasMany,
      targetModelId: Id.Payment,
    },
  ],
}

const customer: Model = {
  id: Id.Customer,
  name: 'customer',
  fields: [
    {
      id: '27',
      name: 'customer_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '28',
      name: 'first_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '29',
      name: 'last_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '30',
      name: 'email',
      type: { type: DataTypeType.String },
    },
    {
      id: '31',
      name: 'active',
      type: { type: DataTypeType.Boolean },
      required: true,
    },
  ],
  associations: [
    {
      id: '1',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Store,
    },
    {
      id: '2',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Address,
    },
    {
      id: '3',
      type: AssociationType.HasMany,
      targetModelId: Id.Rental,
    },
    {
      id: '4',
      type: AssociationType.HasMany,
      targetModelId: Id.Payment,
    },
  ],
}

const address: Model = {
  id: Id.Address,
  name: 'address',
  fields: [
    {
      id: '32',
      name: 'address_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '33',
      name: 'address',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '34',
      name: 'address2',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '35',
      name: 'postal_code',
      type: { type: DataTypeType.String },
    },
    {
      id: '36',
      name: 'phone',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: '5',
      type: AssociationType.BelongsTo,
      targetModelId: Id.City,
    },
    {
      id: '6',
      type: AssociationType.HasOne,
      targetModelId: Id.Customer,
    },
    {
      id: '7',
      type: AssociationType.HasOne,
      targetModelId: Id.Staff,
    },
    {
      id: '8',
      type: AssociationType.HasOne,
      targetModelId: Id.Store,
    },
  ],
}

const rental: Model = {
  id: Id.Rental,
  name: 'rental',
  fields: [
    {
      id: '37',
      name: 'rental_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '38',
      name: 'rental_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
    {
      id: '39',
      name: 'return_date',
      type: { type: DataTypeType.String },
    },
  ],
  associations: [
    {
      id: '9',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Inventory,
    },
    {
      id: '10',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Customer,
    },
    {
      id: '11',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Staff,
    },
    {
      id: '12',
      type: AssociationType.HasMany,
      targetModelId: Id.Payment,
    },
  ],
}

const payment: Model = {
  id: Id.Payment,
  name: 'payment',
  fields: [
    {
      id: '40',
      name: 'payment_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '41',
      name: 'amount',
      type: { type: DataTypeType.Decimal },
      required: true,
    },
    {
      id: '42',
      name: 'payment_date',
      type: { type: DataTypeType.DateTime },
      required: true,
    },
  ],
  associations: [
    {
      id: '13',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Customer,
    },
    {
      id: '14',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Staff,
    },
    {
      id: '15',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Rental,
    },
  ],
}

const city: Model = {
  id: Id.City,
  name: 'city',
  fields: [
    {
      id: '43',
      name: 'city_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '44',
      name: 'city',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: '16',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Country,
    },
    {
      id: '17',
      type: AssociationType.HasMany,
      targetModelId: Id.Address,
    },
  ],
}

const country: Model = {
  id: Id.Country,
  name: 'country',
  fields: [
    {
      id: '45',
      name: 'country_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '46',
      name: 'country',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: '18',
      type: AssociationType.HasMany,
      targetModelId: Id.City,
    },
  ],
}

const film_actor: Model = {
  id: Id.FilmActor,
  name: 'film_actor',
  fields: [
    {
      id: '47',
      name: 'film_actor_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: '19',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Film,
    },
    {
      id: '20',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Actor,
    },
  ],
}

const film_category: Model = {
  id: Id.FilmCategory,
  name: 'film_category',
  fields: [
    {
      id: '48',
      name: 'film_category_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: '21',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Film,
    },
    {
      id: '22',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Category,
    },
  ],
}

// https://dev.mysql.com/doc/sakila/en/
const schema: Schema = {
  id: 'demo-sakila',
  name: 'sakila',
  models: [
    actor,
    film,
    language,
    category,
    inventory,
    store,
    staff,
    customer,
    address,
    rental,
    payment,
    city,
    country,
    film_actor,
    film_category,
  ],
}

export default schema
