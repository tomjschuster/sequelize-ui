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
  association,
  belongsToType,
  blobDataType,
  booleanDataType,
  dateDataType,
  dateTimeDataType,
  decimalDataType,
  enumDataType,
  field,
  hasManyType,
  hasOneType,
  integerDataType,
  manyToManyModelType,
  model,
  Model,
  schema,
  Schema,
  stringDataType,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
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
  FilmText = '_vnTgQDJsBWwhcFK-7p5l',
  Inventory = '1ERjkC0_vMeY0uXOacpZl',
  Language = 'sFHhBnBPK-b99Y9nNZPCn',
  Payment = 'ZD1pRxLzifUyspw9FQlTQ',
  Rental = '1Kgr9IcDpWlcwFPFoILLf',
  Staff = 'v4gwi6U0RXca9Fi2PLyqO',
  Store = 'SKfg8yJLz5XTlCWRuQgMo',
}

const actor: Model = model({
  id: Id.Actor,
  name: 'actor',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'first_name',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'last_name',
      type: stringDataType(),
      required: true,
    }),
  ],
  associations: [
    association({
      type: manyToManyModelType(Id.FilmActor, 'film_id'),
      sourceModelId: Id.Actor,
      targetModelId: Id.Film,
      foreignKey: 'actor_id',
    }),
  ],
})

const film: Model = model({
  id: Id.Film,
  name: 'film',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'title',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'description',
      type: stringDataType(),
    }),
    field({
      name: 'release_year',
      type: integerDataType(),
    }),
    field({
      name: 'language_id',
      type: integerDataType(),
      required: true,
    }),
    field({
      name: 'original_language_id',
      type: integerDataType(),
    }),
    field({
      name: 'rental_duration',
      type: integerDataType(),
      required: true,
    }),
    field({
      name: 'rental_rate',
      type: decimalDataType(),
      required: true,
    }),
    field({
      name: 'length',
      type: integerDataType(),
    }),
    field({
      name: 'rating',
      type: enumDataType({ values: ['G', 'PG', 'PG-13', 'R', 'NC-17'] }),
      required: true,
    }),
    field({
      name: 'special_feature',
      type: arrayDataType({
        arrayType: enumDataType({
          values: ['Trailers', 'Commentaries', 'Deleted Scenes', 'Behind the Scenes'],
        }),
      }),
      required: true,
    }),
  ],
  associations: [
    association({ type: belongsToType(), sourceModelId: Id.Film, targetModelId: Id.Language }),
    association({
      type: belongsToType(),
      sourceModelId: Id.Film,
      targetModelId: Id.Language,
      alias: 'original_language',
      foreignKey: 'original_language_id',
    }),
    association({
      type: hasManyType(),
      sourceModelId: Id.Film,
      targetModelId: Id.Inventory,
      foreignKey: 'film_id',
    }),
    association({
      type: manyToManyModelType(Id.FilmActor, 'actor_id'),
      sourceModelId: Id.Film,
      targetModelId: Id.Actor,
      foreignKey: 'film_id',
    }),
    association({
      type: manyToManyModelType(Id.FilmCategory, 'category_id'),
      sourceModelId: Id.Film,
      targetModelId: Id.Category,
      foreignKey: 'film_id',
    }),
  ],
})

const language: Model = model({
  id: Id.Language,
  name: 'language',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'name',
      type: stringDataType(),
      required: true,
    }),
  ],
  associations: [
    association({ type: hasManyType(), sourceModelId: Id.Language, targetModelId: Id.Film }),
    association({
      type: hasManyType(),
      sourceModelId: Id.Language,
      targetModelId: Id.Film,
      alias: 'original_language_film',
      foreignKey: 'original_language_id',
    }),
  ],
})

const category: Model = model({
  id: Id.Category,
  name: 'category',
  createdAt: time,
  updatedAt: time,
  associations: [
    association({
      type: manyToManyModelType(Id.FilmCategory, 'film_id'),
      sourceModelId: Id.Category,
      targetModelId: Id.Film,
      foreignKey: 'category_id',
    }),
  ],
})

const inventory: Model = model({
  id: Id.Inventory,
  name: 'inventory',
  createdAt: time,
  updatedAt: time,
  associations: [
    association({ type: belongsToType(), sourceModelId: Id.Inventory, targetModelId: Id.Film }),
    association({ type: belongsToType(), sourceModelId: Id.Inventory, targetModelId: Id.Store }),
  ],
})

const store: Model = model({
  id: Id.Store,
  name: 'store',
  createdAt: time,
  updatedAt: time,
  associations: [
    association({ type: hasManyType(), sourceModelId: Id.Store, targetModelId: Id.Inventory }),
    association({ type: hasManyType(), sourceModelId: Id.Store, targetModelId: Id.Staff }),
    association({ type: hasManyType(), sourceModelId: Id.Store, targetModelId: Id.Customer }),
    association({
      type: belongsToType(),
      sourceModelId: Id.Store,
      targetModelId: Id.Staff,
      alias: 'manager',
      foreignKey: 'manager_staff_id',
    }),
    association({ type: belongsToType(), sourceModelId: Id.Store, targetModelId: Id.Address }),
  ],
})

const staff: Model = model({
  id: Id.Staff,
  name: 'staff',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'first_name',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'last_name',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'picture',
      type: blobDataType(),
    }),
    field({
      name: 'email',
      type: stringDataType(),
    }),
    field({
      name: 'active',
      type: booleanDataType(),
      required: true,
    }),
    field({
      name: 'username',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'password',
      type: stringDataType(),
    }),
  ],
  associations: [
    association({ type: belongsToType(), sourceModelId: Id.Store, targetModelId: Id.Staff }),
    association({
      type: hasManyType(),
      sourceModelId: Id.Store,
      targetModelId: Id.Staff,
      alias: 'managed_store',
      foreignKey: 'manager_staff_id',
    }),
    association({ type: belongsToType(), sourceModelId: Id.Address, targetModelId: Id.Staff }),
    association({ type: hasManyType(), sourceModelId: Id.Rental, targetModelId: Id.Staff }),
    association({ type: hasManyType(), sourceModelId: Id.Payment, targetModelId: Id.Staff }),
  ],
})

const customer: Model = model({
  id: Id.Customer,
  name: 'customer',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'first_name',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'last_name',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'email',
      type: stringDataType(),
    }),
    field({
      name: 'active',
      type: booleanDataType(),
      required: true,
    }),
  ],
  associations: [
    association({ type: belongsToType(), sourceModelId: Id.Store, targetModelId: Id.Customer }),
    association({ type: belongsToType(), sourceModelId: Id.Address, targetModelId: Id.Customer }),
    association({ type: hasManyType(), sourceModelId: Id.Rental, targetModelId: Id.Customer }),
    association({ type: hasManyType(), sourceModelId: Id.Payment, targetModelId: Id.Customer }),
  ],
})

const address: Model = model({
  id: Id.Address,
  name: 'address',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'address',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'address2',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'postal_code',
      type: stringDataType(),
    }),
    field({
      name: 'phone',
      type: stringDataType(),
      required: true,
    }),
  ],
  associations: [
    association({ type: belongsToType(), sourceModelId: Id.City, targetModelId: Id.Address }),
    association({ type: hasOneType(), sourceModelId: Id.Customer, targetModelId: Id.Address }),
    association({ type: hasOneType(), sourceModelId: Id.Staff, targetModelId: Id.Address }),
    association({ type: hasOneType(), sourceModelId: Id.Store, targetModelId: Id.Address }),
  ],
})

const rental: Model = model({
  id: Id.Rental,
  name: 'rental',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'rental_date',
      type: dateDataType(),
      required: true,
    }),
    field({
      name: 'return_date',
      type: stringDataType(),
    }),
  ],
  associations: [
    association({ type: belongsToType(), sourceModelId: Id.Inventory, targetModelId: Id.Rental }),
    association({ type: belongsToType(), sourceModelId: Id.Customer, targetModelId: Id.Rental }),
    association({ type: belongsToType(), sourceModelId: Id.Staff, targetModelId: Id.Rental }),
    association({ type: hasManyType(), sourceModelId: Id.Payment, targetModelId: Id.Rental }),
  ],
})

const payment: Model = model({
  id: Id.Payment,
  name: 'payment',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'amount',
      type: decimalDataType(),
      required: true,
    }),
    field({
      name: 'payment_date',
      type: dateTimeDataType(),
      required: true,
    }),
  ],
  associations: [
    association({ type: belongsToType(), sourceModelId: Id.Customer, targetModelId: Id.Payment }),
    association({ type: belongsToType(), sourceModelId: Id.Staff, targetModelId: Id.Payment }),
    association({ type: belongsToType(), sourceModelId: Id.Rental, targetModelId: Id.Payment }),
  ],
})

const city: Model = model({
  id: Id.City,
  name: 'city',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'city',
      type: stringDataType(),
      required: true,
    }),
  ],
  associations: [
    association({ type: belongsToType(), sourceModelId: Id.Country, targetModelId: Id.City }),
    association({ type: hasManyType(), sourceModelId: Id.Address, targetModelId: Id.City }),
  ],
})

const country: Model = model({
  id: Id.Country,
  name: 'country',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'country',
      type: stringDataType(),
      required: true,
    }),
  ],
  associations: [
    association({ type: hasManyType(), sourceModelId: Id.City, targetModelId: Id.Country }),
  ],
})

const film_actor: Model = model({
  id: Id.FilmActor,
  name: 'film_actor',
  createdAt: time,
  updatedAt: time,
  associations: [
    association({ type: belongsToType(), sourceModelId: Id.FilmActor, targetModelId: Id.Film }),
    association({ type: belongsToType(), sourceModelId: Id.FilmActor, targetModelId: Id.Actor }),
  ],
})

const film_category: Model = model({
  id: Id.FilmCategory,
  name: 'film_category',
  createdAt: time,
  updatedAt: time,
  associations: [
    association({ type: belongsToType(), sourceModelId: Id.FilmCategory, targetModelId: Id.Film }),
    association({
      type: belongsToType(),
      sourceModelId: Id.FilmCategory,
      targetModelId: Id.Category,
    }),
  ],
})

// https://dev.mysql.com/doc/sakila/en/
const sakilaSchema: Schema = schema({
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
})

export default sakilaSchema
