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
      name: 'actor_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'first_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'last_name',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
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
      name: 'film_id',
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
      name: 'release_year',
      type: { type: DataTypeType.Integer },
    },
    {
      name: 'language_id',
      type: { type: DataTypeType.Integer },
      required: true,
    },
    {
      name: 'original_language_id',
      type: { type: DataTypeType.Integer },
    },
    {
      name: 'rental_duration',
      type: { type: DataTypeType.Integer },
      required: true,
    },
    {
      name: 'rental_rate',
      type: { type: DataTypeType.Decimal },
      required: true,
    },
    {
      name: 'length',
      type: { type: DataTypeType.Integer },
    },
    {
      name: 'rating',
      type: { type: DataTypeType.Enum, values: ['G', 'PG', 'PG-13', 'R', 'NC-17'] },
      required: true,
    },
    {
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
      type: AssociationType.BelongsTo,
      targetModelId: Id.Language,
    },
    {
      alias: 'original_language',
      foreignKey: 'original_language_id',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Language,
    },
    {
      foreignKey: 'film_id',
      type: AssociationType.HasMany,
      targetModelId: Id.Inventory,
    },
    {
      foreignKey: 'film_id',
      targetFk: 'actor_id',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.FilmActor },
      targetModelId: Id.Actor,
    },
    {
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
      name: 'language_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      type: AssociationType.HasMany,
      targetModelId: Id.Film,
    },
    {
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
      name: 'category_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
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
      name: 'inventory_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Film,
    },
    {
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
      name: 'store_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      type: AssociationType.HasMany,
      targetModelId: Id.Inventory,
    },
    {
      type: AssociationType.HasMany,
      targetModelId: Id.Staff,
    },
    {
      type: AssociationType.HasMany,
      targetModelId: Id.Customer,
    },
    {
      alias: 'manager',
      foreignKey: 'manager_staff_id',
      type: AssociationType.BelongsTo,
      targetModelId: Id.Staff,
    },
    {
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
      name: 'staff_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'first_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'last_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'picture',
      type: { type: DataTypeType.Blob },
    },
    {
      name: 'email',
      type: { type: DataTypeType.String },
    },
    {
      name: 'active',
      type: { type: DataTypeType.Boolean },
      required: true,
    },
    {
      name: 'username',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'password',
      type: { type: DataTypeType.String },
    },
  ],
  associations: [
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Store,
    },
    {
      alias: 'managed_store',
      foreignKey: 'manager_staff_id',
      type: AssociationType.HasMany,
      targetModelId: Id.Store,
    },
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Address,
    },
    {
      type: AssociationType.HasMany,
      targetModelId: Id.Rental,
    },
    {
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
      name: 'customer_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'first_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'last_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'email',
      type: { type: DataTypeType.String },
    },
    {
      name: 'active',
      type: { type: DataTypeType.Boolean },
      required: true,
    },
  ],
  associations: [
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Store,
    },
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Address,
    },
    {
      type: AssociationType.HasMany,
      targetModelId: Id.Rental,
    },
    {
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
      name: 'address_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'address',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'address2',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      name: 'postal_code',
      type: { type: DataTypeType.String },
    },
    {
      name: 'phone',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.City,
    },
    {
      type: AssociationType.HasOne,
      targetModelId: Id.Customer,
    },
    {
      type: AssociationType.HasOne,
      targetModelId: Id.Staff,
    },
    {
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
      name: 'rental_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'rental_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
    {
      name: 'return_date',
      type: { type: DataTypeType.String },
    },
  ],
  associations: [
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Inventory,
    },
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Customer,
    },
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Staff,
    },
    {
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
      name: 'payment_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'amount',
      type: { type: DataTypeType.Decimal },
      required: true,
    },
    {
      name: 'payment_date',
      type: { type: DataTypeType.DateTime },
      required: true,
    },
  ],
  associations: [
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Customer,
    },
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Staff,
    },
    {
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
      name: 'city_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'city',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Country,
    },
    {
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
      name: 'country_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      name: 'country',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
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
      name: 'film_actor_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Film,
    },
    {
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
      name: 'film_category_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Film,
    },
    {
      type: AssociationType.BelongsTo,
      targetModelId: Id.Category,
    },
  ],
}

// https://dev.mysql.com/doc/sakila/en/
const schema: Schema = {
  id: '1',
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
