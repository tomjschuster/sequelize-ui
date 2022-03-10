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

import {
  arrayDataType,
  belongsToType,
  blobDataType,
  booleanDataType,
  dateDataType,
  dateTimeDataType,
  decimalDataType,
  enumDataType,
  hasManyType,
  hasOneType,
  integerDataType,
  manyToManyModelType,
  Model,
  Schema,
  stringDataType,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import { uniqueId } from '@src/utils/string'
import { SAKILA_ID } from './ids'

const time = fromParts(2020, 1, 1)

enum Id {
  Actor = 'Cj2ryEukV8eC6pxPh0ImQ',
  Address = 'EaeyW54286H0LYMlL4yNC',
  Category = 'ghwqmtb04vVN1XjMCSfaC',
  City = '7Ivmj8L0CLivaaO38kX6n',
  Country = 'j2qp_eMyS6_RdOlCn4LHU',
  Customer = 'PrbEOUTwohzjx858CKLyh',
  Film = '6isxvTSCeLG7Xh4hPebzK',
  FilmActor = 'Q3OuSWRTbaYlshJmIFrSi',
  FilmCategory = 'QMhycXXUZ9FCxWZOAsoU7',
  Inventory = '1ERjkC0_vMeY0uXOacpZl',
  Language = 'sFHhBnBPK-b99Y9nNZPCn',
  Payment = 'ZD1pRxLzifUyspw9FQlTQ',
  Rental = '1Kgr9IcDpWlcwFPFoILLf',
  Staff = 'v4gwi6U0RXca9Fi2PLyqO',
  Store = 'SKfg8yJLz5XTlCWRuQgMo',
}

const actor: Model = {
  id: Id.Actor,
  name: 'actor',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: uniqueId(),
      name: 'first_name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'last_name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: 'actor_id',
      sourceModelId: Id.Actor,
      targetModelId: Id.Film,
      type: manyToManyModelType(Id.FilmActor, 'film_id'),
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
      id: uniqueId(),
      name: 'title',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'description',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'release_year',
      type: integerDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'language_id',
      type: integerDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'original_language_id',
      type: integerDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'rental_duration',
      type: integerDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'rental_rate',
      type: decimalDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'length',
      type: integerDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'rating',
      type: enumDataType({ values: ['G', 'PG', 'PG-13', 'R', 'NC-17'] }),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'special_feature',
      type: arrayDataType({
        arrayType: enumDataType({
          values: ['Trailers', 'Commentaries', 'Deleted Scenes', 'Behind the Scenes'],
        }),
      }),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: Id.Film,
      targetModelId: Id.Language,
    },
    {
      id: uniqueId(),
      alias: 'original_language',
      foreignKey: 'original_language_id',
      type: belongsToType(),
      sourceModelId: Id.Film,
      targetModelId: Id.Language,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: 'film_id',
      type: hasManyType(),
      sourceModelId: Id.Film,
      targetModelId: Id.Inventory,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: 'film_id',
      sourceModelId: Id.Film,
      targetModelId: Id.Actor,
      type: manyToManyModelType(Id.FilmActor, 'actor_id'),
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: 'film_id',
      sourceModelId: Id.Film,
      targetModelId: Id.Category,
      type: manyToManyModelType(Id.FilmCategory, 'category_id'),
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
      id: uniqueId(),
      name: 'name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: Id.Language,
      targetModelId: Id.Film,
    },
    {
      id: uniqueId(),
      alias: 'original_language_film',
      foreignKey: 'original_language_id',
      type: hasManyType(),
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
      id: uniqueId(),
      name: 'name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: 'category_id',
      sourceModelId: Id.Category,
      targetModelId: Id.Film,
      type: manyToManyModelType(Id.FilmCategory, 'film_id'),
    },
  ],
}

const inventory: Model = {
  id: Id.Inventory,
  name: 'inventory',
  createdAt: time,
  updatedAt: time,
  fields: [],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: Id.Inventory,
      targetModelId: Id.Film,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
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
  fields: [],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: Id.Store,
      targetModelId: Id.Inventory,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: Id.Store,
      targetModelId: Id.Staff,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      sourceModelId: Id.Store,
      targetModelId: Id.Customer,
    },
    {
      id: uniqueId(),
      alias: 'manager',
      foreignKey: 'manager_staff_id',
      type: belongsToType(),
      sourceModelId: Id.Store,
      targetModelId: Id.Staff,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
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
      id: uniqueId(),
      name: 'first_name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'last_name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'picture',
      type: blobDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'email',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'active',
      type: booleanDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'username',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'password',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      targetModelId: Id.Store,
      sourceModelId: Id.Staff,
    },
    {
      id: uniqueId(),
      alias: 'managed_store',
      foreignKey: 'manager_staff_id',
      type: hasManyType(),
      targetModelId: Id.Store,
      sourceModelId: Id.Staff,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      targetModelId: Id.Address,
      sourceModelId: Id.Staff,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      targetModelId: Id.Rental,
      sourceModelId: Id.Staff,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasManyType(),
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
      id: uniqueId(),
      name: 'first_name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'last_name',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'email',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'active',
      type: booleanDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      targetModelId: Id.Store,
      sourceModelId: Id.Customer,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      targetModelId: Id.Address,
      sourceModelId: Id.Customer,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasManyType(),
      targetModelId: Id.Rental,
      sourceModelId: Id.Customer,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasManyType(),
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
      id: uniqueId(),
      name: 'address',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'address2',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'postal_code',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'phone',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      targetModelId: Id.City,
      sourceModelId: Id.Address,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasOneType(),
      targetModelId: Id.Customer,
      sourceModelId: Id.Address,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasOneType(),
      targetModelId: Id.Staff,
      sourceModelId: Id.Address,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasOneType(),
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
      id: uniqueId(),
      name: 'rental_date',
      type: dateDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'return_date',
      type: stringDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      targetModelId: Id.Inventory,
      sourceModelId: Id.Rental,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      targetModelId: Id.Customer,
      sourceModelId: Id.Rental,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      targetModelId: Id.Staff,
      sourceModelId: Id.Rental,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasManyType(),
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
      id: uniqueId(),
      name: 'amount',
      type: decimalDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'payment_date',
      type: dateTimeDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      targetModelId: Id.Customer,
      sourceModelId: Id.Payment,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      targetModelId: Id.Staff,
      sourceModelId: Id.Payment,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
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
      id: uniqueId(),
      name: 'city',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      targetModelId: Id.Country,
      sourceModelId: Id.City,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasManyType(),
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
      id: uniqueId(),
      name: 'country',
      type: stringDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: hasManyType(),
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
  fields: [],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: Id.FilmActor,
      targetModelId: Id.Film,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
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
  fields: [],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
      sourceModelId: Id.FilmCategory,
      targetModelId: Id.Film,
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      type: belongsToType(),
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
  forkedFrom: null,
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
