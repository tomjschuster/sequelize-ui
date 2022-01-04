/**
 * Sakila Sample Database Schema
 * Version 1.2
 *
 * Original schema and data created by Mike Hillyer with the MySQL AB documentation team
 * https://dev.mysql.com/doc/index-other.html
 *
 * Sequelize UI TypeScript schema by Tom Schuster
 *
 * Copyright (c) 2006, 2019, Oracle and/or its affiliates.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * 3. Neither the name of Oracle nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import { AssociationTypeType, DataTypeType, Model, Schema, ThroughType } from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import shortid from 'shortid'
import { SAKILA_ID } from './ids'

const time = fromParts(2020, 1, 1)

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
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'actor_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'first_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'last_name',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      foreignKey: 'actor_id',
      sourceModelId: Id.Actor,
      targetModelId: Id.Film,
      type: {
        type: AssociationTypeType.ManyToMany,
        targetFk: 'film_id',
        through: { type: ThroughType.ThroughModel, modelId: Id.FilmActor },
      },
    },
  ],
}

const film: Model = {
  id: Id.Film,
  name: 'film',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'film_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'title',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'description',
      type: { type: DataTypeType.String },
    },
    {
      id: shortid(),
      name: 'release_year',
      type: { type: DataTypeType.Integer },
    },
    {
      id: shortid(),
      name: 'language_id',
      type: { type: DataTypeType.Integer },
      required: true,
    },
    {
      id: shortid(),
      name: 'original_language_id',
      type: { type: DataTypeType.Integer },
    },
    {
      id: shortid(),
      name: 'rental_duration',
      type: { type: DataTypeType.Integer },
      required: true,
    },
    {
      id: shortid(),
      name: 'rental_rate',
      type: { type: DataTypeType.Decimal },
      required: true,
    },
    {
      id: shortid(),
      name: 'length',
      type: { type: DataTypeType.Integer },
    },
    {
      id: shortid(),
      name: 'rating',
      type: { type: DataTypeType.Enum, values: ['G', 'PG', 'PG-13', 'R', 'NC-17'] },
      required: true,
    },
    {
      id: shortid(),
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
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.Film,
      targetModelId: Id.Language,
    },
    {
      id: shortid(),
      alias: 'original_language',
      foreignKey: 'original_language_id',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.Film,
      targetModelId: Id.Language,
    },
    {
      id: shortid(),
      foreignKey: 'film_id',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Film,
      targetModelId: Id.Inventory,
    },
    {
      id: shortid(),
      foreignKey: 'film_id',
      sourceModelId: Id.Film,
      targetModelId: Id.Actor,
      type: {
        type: AssociationTypeType.ManyToMany,
        targetFk: 'actor_id',
        through: { type: ThroughType.ThroughModel, modelId: Id.FilmActor },
      },
    },
    {
      id: shortid(),
      foreignKey: 'film_id',
      sourceModelId: Id.Film,
      targetModelId: Id.Category,
      type: {
        type: AssociationTypeType.ManyToMany,
        targetFk: 'category_id',
        through: { type: ThroughType.ThroughModel, modelId: Id.FilmCategory },
      },
    },
  ],
}

const language: Model = {
  id: Id.Language,
  name: 'language',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'language_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'name',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Language,
      targetModelId: Id.Film,
    },
    {
      id: shortid(),
      alias: 'original_language_film',
      foreignKey: 'original_language_id',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Language,
      targetModelId: Id.Film,
    },
  ],
}

const category: Model = {
  id: Id.Category,
  name: 'category',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'category_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      foreignKey: 'category_id',
      sourceModelId: Id.Category,
      targetModelId: Id.Film,
      type: {
        type: AssociationTypeType.ManyToMany,
        targetFk: 'film_id',
        through: { type: ThroughType.ThroughModel, modelId: Id.FilmCategory },
      },
    },
  ],
}

const inventory: Model = {
  id: Id.Inventory,
  name: 'inventory',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'inventory_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.Inventory,
      targetModelId: Id.Film,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.Inventory,
      targetModelId: Id.Store,
    },
  ],
}

const store: Model = {
  id: Id.Store,
  name: 'store',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'store_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Store,
      targetModelId: Id.Inventory,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Store,
      targetModelId: Id.Staff,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Store,
      targetModelId: Id.Customer,
    },
    {
      id: shortid(),
      alias: 'manager',
      foreignKey: 'manager_staff_id',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.Store,
      targetModelId: Id.Staff,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.Store,
      targetModelId: Id.Address,
    },
  ],
}

const staff: Model = {
  id: Id.Staff,
  name: 'staff',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'staff_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'first_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'last_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'picture',
      type: { type: DataTypeType.Blob },
    },
    {
      id: shortid(),
      name: 'email',
      type: { type: DataTypeType.String },
    },
    {
      id: shortid(),
      name: 'active',
      type: { type: DataTypeType.Boolean },
      required: true,
    },
    {
      id: shortid(),
      name: 'username',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'password',
      type: { type: DataTypeType.String },
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.Store,
      sourceModelId: Id.Staff,
    },
    {
      id: shortid(),
      alias: 'managed_store',
      foreignKey: 'manager_staff_id',
      type: { type: AssociationTypeType.HasMany },
      targetModelId: Id.Store,
      sourceModelId: Id.Staff,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.Address,
      sourceModelId: Id.Staff,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasMany },
      targetModelId: Id.Rental,
      sourceModelId: Id.Staff,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasMany },
      targetModelId: Id.Payment,
      sourceModelId: Id.Staff,
    },
  ],
}

const customer: Model = {
  id: Id.Customer,
  name: 'customer',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'customer_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'first_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'last_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'email',
      type: { type: DataTypeType.String },
    },
    {
      id: shortid(),
      name: 'active',
      type: { type: DataTypeType.Boolean },
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.Store,
      sourceModelId: Id.Customer,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.Address,
      sourceModelId: Id.Customer,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasMany },
      targetModelId: Id.Rental,
      sourceModelId: Id.Customer,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasMany },
      targetModelId: Id.Payment,
      sourceModelId: Id.Customer,
    },
  ],
}

const address: Model = {
  id: Id.Address,
  name: 'address',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'address_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'address',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'address2',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'postal_code',
      type: { type: DataTypeType.String },
    },
    {
      id: shortid(),
      name: 'phone',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.City,
      sourceModelId: Id.Address,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasOne },
      targetModelId: Id.Customer,
      sourceModelId: Id.Address,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasOne },
      targetModelId: Id.Staff,
      sourceModelId: Id.Address,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasOne },
      targetModelId: Id.Store,
      sourceModelId: Id.Address,
    },
  ],
}

const rental: Model = {
  id: Id.Rental,
  name: 'rental',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'rental_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'rental_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
    {
      id: shortid(),
      name: 'return_date',
      type: { type: DataTypeType.String },
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.Inventory,
      sourceModelId: Id.Rental,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.Customer,
      sourceModelId: Id.Rental,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.Staff,
      sourceModelId: Id.Rental,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasMany },
      targetModelId: Id.Payment,
      sourceModelId: Id.Rental,
    },
  ],
}

const payment: Model = {
  id: Id.Payment,
  name: 'payment',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'payment_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'amount',
      type: { type: DataTypeType.Decimal },
      required: true,
    },
    {
      id: shortid(),
      name: 'payment_date',
      type: { type: DataTypeType.DateTime },
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.Customer,
      sourceModelId: Id.Payment,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.Staff,
      sourceModelId: Id.Payment,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.Rental,
      sourceModelId: Id.Payment,
    },
  ],
}

const city: Model = {
  id: Id.City,
  name: 'city',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'city_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'city',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      targetModelId: Id.Country,
      sourceModelId: Id.City,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasMany },
      targetModelId: Id.Address,
      sourceModelId: Id.City,
    },
  ],
}

const country: Model = {
  id: Id.Country,
  name: 'country',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'country_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'country',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.HasMany },
      targetModelId: Id.City,
      sourceModelId: Id.Country,
    },
  ],
}

const film_actor: Model = {
  id: Id.FilmActor,
  name: 'film_actor',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'film_actor_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.FilmActor,
      targetModelId: Id.Film,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.FilmActor,
      targetModelId: Id.Actor,
    },
  ],
}

const film_category: Model = {
  id: Id.FilmCategory,
  name: 'film_category',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: shortid(),
      name: 'film_category_id',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.FilmCategory,
      targetModelId: Id.Film,
    },
    {
      id: shortid(),
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.FilmCategory,
      targetModelId: Id.Category,
    },
  ],
}

// https://dev.mysql.com/doc/sakila/en/
const sakilaSchema: Schema = {
  id: SAKILA_ID,
  name: 'sakila',
  createdAt: time,
  updatedAt: time,
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

export default sakilaSchema
