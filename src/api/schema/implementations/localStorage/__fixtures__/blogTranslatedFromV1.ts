/**
 * Blog Database
 *
 * Original SQL schema created by Bhagwat Singh Chouhan
 * https://github.com/tutorials24x7/blog-database-mysql
 *
 * Sequelize UI TypeScript schema by Tom Schuster
 *
 * MIT License
 * Copyright (c) 2020 Tutorisl24x7
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
import {
  Model,
  Schema,
  association,
  belongsToType,
  bigIntDataType,
  booleanDataType,
  dateTimeDataType,
  field,
  hasManyType,
  manyToManyModelType,
  model,
  schema,
  stringDataType,
  textDataType,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'

const time = fromParts(2021, 4, 1)

const Id = {
  Category: 'RZw1R8F3R',
  Post: 'ZEtbbSMiMN',
  PostCategory: 'eJhVQn-fbl',
  PostComment: 'ZUWpjWOLq0',
  PostMeta: 'uLIROucWln',
  PostTag: 'TXvlm_CHfJ',
  Tag: 'ttHbif2iFE',
  User: 'ivaiETEdGs',
} as const

const category: Model = model({
  id: Id.Category,
  name: 'category',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      id: 'T4qQXIU57t',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
    field({
      id: 'wLaKerwKHR',
      name: 'title',
      type: stringDataType({ length: 75 }),
      required: true,
    }),
    field({
      id: 'B1XfKBFlVl',
      name: 'meta title',
      type: stringDataType({ length: 100 }),
    }),
    field({
      id: 'BCinV1ySl1',
      name: 'slug',
      type: stringDataType({ length: 100 }),
      required: true,
      unique: true,
    }),
    field({
      id: 'F8N_KcjAqE',
      name: 'content',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
      id: 'oDibzTR5C',
      alias: 'parent',
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      type: belongsToType(),
    }),
    association({
      id: '7lc6O2PM91',
      alias: 'children',
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      type: hasManyType(),
    }),
    association({
      id: 'wcfc-hVPMo',
      sourceModelId: Id.Category,
      targetModelId: Id.PostCategory,
      type: hasManyType(),
    }),
    association({
      id: 'hN7l0LA6k5l',
      sourceModelId: Id.Category,
      targetModelId: Id.Post,
      type: manyToManyModelType(Id.PostCategory),
    }),
  ],
})

const post: Model = model({
  id: Id.Post,
  name: 'post',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      id: 'JF3PYgKWdxc',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
    field({
      id: 'uS6fbupku5b',
      name: 'title',
      type: stringDataType({ length: 75 }),
      required: true,
    }),
    field({
      id: '8tK7CCDZt2R',
      name: 'meta title',
      type: stringDataType({ length: 100 }),
    }),
    field({
      id: 'ljY-X8RoAL_',
      name: 'slug',
      type: stringDataType({ length: 100 }),
      required: true,
      unique: true,
    }),
    field({
      id: '6rlsTFVLWD8',
      name: 'summary',
      type: textDataType(),
    }),
    field({
      id: 'vDhgus3e1M8',
      name: 'published',
      type: booleanDataType(),
      required: true,
    }),
    field({
      id: 'WWVBERtnLH5',
      name: 'published at',
      type: dateTimeDataType(),
    }),
    field({
      id: 'JZX74kV3RJB',
      name: 'content',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
      id: '_XbLHymzQ54',
      alias: 'author',
      sourceModelId: Id.Post,
      targetModelId: Id.User,
      type: belongsToType(),
    }),
    association({
      id: 'XHnda0nh3I8',
      alias: 'parent',
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: belongsToType(),
    }),
    association({
      id: 'uokEC1_-88B',
      alias: 'children',
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: hasManyType(),
    }),
    association({
      id: 'nZBcsVQMiVe',
      sourceModelId: Id.Post,
      targetModelId: Id.PostCategory,
      type: hasManyType(),
    }),
    association({
      id: 'GTvEzMsP-CY',
      sourceModelId: Id.Post,
      targetModelId: Id.Category,
      type: manyToManyModelType(Id.PostCategory),
    }),
    association({
      id: 'nMAVYlaMC77',
      alias: 'comments',
      sourceModelId: Id.Post,
      targetModelId: Id.PostComment,
      type: hasManyType(),
    }),
    association({
      id: 'MXFKBquNNI6',
      alias: 'meta',
      sourceModelId: Id.Post,
      targetModelId: Id.PostMeta,
      type: hasManyType(),
    }),
    association({
      id: 'UV43MPRd0Lt',
      sourceModelId: Id.Post,
      targetModelId: Id.PostTag,
      type: hasManyType(),
    }),
    association({
      id: 'skZFJbJB6hh',
      sourceModelId: Id.Post,
      targetModelId: Id.Tag,
      type: manyToManyModelType(Id.PostTag),
    }),
  ],
})

const postCategory: Model = model({
  id: Id.PostCategory,
  name: 'post category',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      id: 'jdRrJjdcKkE',
      name: 'post id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
    field({
      id: '3woIOm-7Iwk',
      name: 'category id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
  ],
  associations: [
    association({
      id: '3woIOm-7Iwk',
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Post,
      type: belongsToType(),
    }),
    association({
      id: 'YN5x8WTSUv0',
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Category,
      type: belongsToType(),
    }),
  ],
})

const postComment: Model = model({
  id: Id.PostComment,
  name: 'post comment',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      id: 'pPx2dKSCxUU',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
    field({
      id: 'Unedw8_4esY',
      name: 'title',
      type: stringDataType({ length: 75 }),
      required: true,
    }),
    field({
      id: 'py--ks_YQhk',
      name: 'published',
      type: booleanDataType(),
      required: true,
    }),
    field({
      id: 'AqsMlWfzsrp',
      name: 'published at',
      type: dateTimeDataType(),
    }),
    field({
      id: 'P_KCQh8vR4i',
      name: 'content',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
      id: 'w5mBh5K4X3W',
      sourceModelId: Id.PostComment,
      targetModelId: Id.Post,
      type: belongsToType(),
    }),
    association({
      id: '57xLCZkr22k',
      alias: 'parent',
      sourceModelId: Id.PostComment,
      targetModelId: Id.PostComment,
      type: belongsToType(),
    }),
    association({
      id: 'XZuWMYVjX9q',
      alias: 'children',
      sourceModelId: Id.PostComment,
      targetModelId: Id.PostComment,
      type: hasManyType(),
    }),
  ],
})

const postMeta: Model = model({
  id: Id.PostMeta,
  name: 'post meta',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      id: '_9jdNTR-39N',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
    field({
      id: 'u98W4zMVB7K',
      name: 'key',
      type: stringDataType({ length: 50 }),
      required: true,
      unique: true,
    }),
    field({
      id: '_EqtSrP0p6x',
      name: 'content',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
      id: '0uE8EJCVIAD',
      sourceModelId: Id.PostMeta,
      targetModelId: Id.Post,
      type: belongsToType(),
    }),
  ],
})

const postTag: Model = model({
  id: Id.PostTag,
  name: 'post tag',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      id: 'wGszJWpxTPh',
      name: 'post id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
    field({
      id: 'YlgLSgY8Skr',
      name: 'tag id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
  ],
  associations: [
    association({
      id: '6Uh5opGS8LM',
      sourceModelId: Id.PostTag,
      targetModelId: Id.Post,
      type: belongsToType(),
    }),
    association({
      id: 'xCR4XtTuYjT',
      sourceModelId: Id.PostTag,
      targetModelId: Id.Tag,
      type: belongsToType(),
    }),
  ],
})

const tag: Model = model({
  id: Id.Tag,
  name: 'tag',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      id: 'FshuF93yknb',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
    field({
      id: '8x7OAEK9LjG',
      name: 'title',
      type: stringDataType({ length: 75 }),
      required: true,
    }),
    field({
      id: 'M2LEr5WWtYq',
      name: 'meta title',
      type: stringDataType({ length: 100 }),
    }),
    field({
      id: 'ePkkPVQvLF5',
      name: 'slug',
      type: stringDataType({ length: 100 }),
      required: true,
      unique: true,
    }),
    field({
      id: 'eC71J1JAiW5',
      name: 'content',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
      id: 'Ch1tFcak4kC',
      sourceModelId: Id.Tag,
      targetModelId: Id.PostTag,
      type: hasManyType(),
    }),
    association({
      id: 'zUJ6zJEZ_TB',
      sourceModelId: Id.Tag,
      targetModelId: Id.Post,
      type: manyToManyModelType(Id.PostTag),
    }),
  ],
})

const user: Model = model({
  id: Id.User,
  name: 'user',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      id: 'qjr5fhyBQJk',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
    field({
      id: 'QpCuohYW2Hs',
      name: 'first name',
      type: stringDataType({ length: 50 }),
    }),
    field({
      id: '4XJNERwnZG5',
      name: 'middle name',
      type: stringDataType({ length: 50 }),
    }),
    field({
      id: 'zG96hHN_eh2',
      name: 'last name',
      type: stringDataType({ length: 50 }),
    }),
    field({
      id: '8fYf5Z9TdLb',
      name: 'mobile',
      type: stringDataType({ length: 15 }),
    }),
    field({
      id: 'fKxR-4rs0UV',
      name: 'email',
      type: stringDataType({ length: 50 }),
    }),
    field({
      id: 'rcsZ85LnFsf',
      name: 'password hash',
      type: stringDataType({ length: 32 }),
    }),
    field({
      id: 'uHB2pNmoPGS',
      name: 'registered at',
      type: dateTimeDataType({ defaultNow: true }),
      required: true,
    }),
    field({
      id: '_MA5Jrs0QRM',
      name: 'last login',
      type: dateTimeDataType(),
    }),
    field({
      id: 'tOGxTjl7N8V',
      name: 'intro',
      type: textDataType(),
    }),
    field({
      id: 'X2g0Pw8QFq1',
      name: 'profile',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
      id: 'pbNmGR7mt4P',
      sourceModelId: Id.User,
      targetModelId: Id.Post,
      type: hasManyType(),
      foreignKey: 'author id',
    }),
  ],
})

export const blogTranslatedFromV1: Schema = schema({
  id: 'akwgxGmESSK',
  name: 'blog',
  createdAt: time,
  updatedAt: time,
  models: [category, post, postCategory, postComment, postMeta, postTag, tag, user],
})
