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
  belongsToType,
  bigIntDataType,
  booleanDataType,
  dateTimeDataType,
  hasManyType,
  stringDataType,
  textDataType,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import { Model, SchemaV1 } from '../v1'

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

const category: Model = {
  id: Id.Category,
  name: 'category',
  softDelete: false,
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: 'T4qQXIU57t',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
    {
      id: 'wLaKerwKHR',
      name: 'title',
      type: stringDataType({ length: 75 }),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: 'B1XfKBFlVl',
      name: 'meta title',
      type: stringDataType({ length: 100 }),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'BCinV1ySl1',
      name: 'slug',
      type: stringDataType({ length: 100 }),
      primaryKey: false,
      required: true,
      unique: true,
    },
    {
      id: 'F8N_KcjAqE',
      name: 'content',
      type: textDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: 'oDibzTR5C',
      alias: 'parent',
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      type: belongsToType(),
      foreignKey: null,
    },
    {
      id: '7lc6O2PM91',
      alias: 'children',
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      type: hasManyType(),
      foreignKey: null,
    },
    {
      id: 'wcfc-hVPMo',
      alias: null,
      sourceModelId: Id.Category,
      targetModelId: Id.PostCategory,
      type: hasManyType(),
      foreignKey: null,
    },
    {
      id: 'hN7l0LA6k5l',
      alias: null,
      sourceModelId: Id.Category,
      targetModelId: Id.Post,
      type: {
        type: 'MANY_TO_MANY',
        through: { type: 'THROUGH_MODEL', modelId: Id.PostCategory },
        targetFk: null,
      },
      foreignKey: null,
    },
  ],
}

const post: Model = {
  id: Id.Post,
  name: 'post',
  softDelete: false,
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: 'JF3PYgKWdxc',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,

      required: false,
      unique: false,
    },
    {
      id: 'uS6fbupku5b',
      name: 'title',
      type: stringDataType({ length: 75 }),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: '8tK7CCDZt2R',
      name: 'meta title',
      type: stringDataType({ length: 100 }),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'ljY-X8RoAL_',
      name: 'slug',
      type: stringDataType({ length: 100 }),
      primaryKey: false,
      required: true,
      unique: true,
    },
    {
      id: '6rlsTFVLWD8',
      name: 'summary',
      type: textDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'vDhgus3e1M8',
      name: 'published',
      type: booleanDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: 'WWVBERtnLH5',
      name: 'published at',
      type: dateTimeDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'JZX74kV3RJB',
      name: 'content',
      type: textDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: '_XbLHymzQ54',
      alias: 'author',
      sourceModelId: Id.Post,
      targetModelId: Id.User,
      type: belongsToType(),
      foreignKey: null,
    },
    {
      id: 'XHnda0nh3I8',
      alias: 'parent',
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: belongsToType(),
      foreignKey: null,
    },
    {
      id: 'uokEC1_-88B',
      alias: 'children',
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: hasManyType(),
      foreignKey: null,
    },
    {
      id: 'nZBcsVQMiVe',
      alias: null,
      sourceModelId: Id.Post,
      targetModelId: Id.PostCategory,
      type: hasManyType(),
      foreignKey: null,
    },
    {
      id: 'GTvEzMsP-CY',
      alias: null,
      sourceModelId: Id.Post,
      targetModelId: Id.Category,
      type: {
        type: 'MANY_TO_MANY',
        through: { type: 'THROUGH_MODEL', modelId: Id.PostCategory },
        targetFk: null,
      },
      foreignKey: null,
    },
    {
      id: 'nMAVYlaMC77',
      alias: 'comments',
      sourceModelId: Id.Post,
      targetModelId: Id.PostComment,
      type: hasManyType(),
      foreignKey: null,
    },
    {
      id: 'MXFKBquNNI6',
      alias: 'meta',
      sourceModelId: Id.Post,
      targetModelId: Id.PostMeta,
      type: hasManyType(),
      foreignKey: null,
    },
    {
      id: 'UV43MPRd0Lt',
      alias: null,
      sourceModelId: Id.Post,
      targetModelId: Id.PostTag,
      type: hasManyType(),
      foreignKey: null,
    },
    {
      id: 'skZFJbJB6hh',
      alias: null,
      sourceModelId: Id.Post,
      targetModelId: Id.Tag,
      type: {
        type: 'MANY_TO_MANY',
        through: { type: 'THROUGH_MODEL', modelId: Id.PostTag },
        targetFk: null,
      },
      foreignKey: null,
    },
  ],
}

const postCategory: Model = {
  id: Id.PostCategory,
  name: 'post category',
  softDelete: false,
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: 'jdRrJjdcKkE',
      name: 'post id',
      type: bigIntDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
    {
      id: '3woIOm-7Iwk',
      name: 'category id',
      type: bigIntDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: '3woIOm-7Iwk',
      alias: null,
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Post,
      type: belongsToType(),
      foreignKey: null,
    },
    {
      id: 'YN5x8WTSUv0',
      alias: null,
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Category,
      type: belongsToType(),
      foreignKey: null,
    },
  ],
}

const postComment: Model = {
  id: Id.PostComment,
  name: 'post comment',
  softDelete: false,
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: 'pPx2dKSCxUU',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
    {
      id: 'Unedw8_4esY',
      name: 'title',
      type: stringDataType({ length: 75 }),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: 'py--ks_YQhk',
      name: 'published',
      type: booleanDataType(),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: 'AqsMlWfzsrp',
      name: 'published at',
      type: dateTimeDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'P_KCQh8vR4i',
      name: 'content',
      type: textDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: 'w5mBh5K4X3W',
      alias: null,
      sourceModelId: Id.PostComment,
      targetModelId: Id.Post,
      type: belongsToType(),
      foreignKey: null,
    },
    {
      id: '57xLCZkr22k',
      alias: 'parent',
      sourceModelId: Id.PostComment,
      targetModelId: Id.PostComment,
      type: belongsToType(),
      foreignKey: null,
    },
    {
      id: 'XZuWMYVjX9q',
      alias: 'children',
      sourceModelId: Id.PostComment,
      targetModelId: Id.PostComment,
      type: hasManyType(),
      foreignKey: null,
    },
  ],
}

const postMeta: Model = {
  id: Id.PostMeta,
  name: 'post meta',
  softDelete: false,
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '_9jdNTR-39N',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
    {
      id: 'u98W4zMVB7K',
      name: 'key',
      type: stringDataType({ length: 50 }),
      primaryKey: false,
      required: true,
      unique: true,
    },
    {
      id: '_EqtSrP0p6x',
      name: 'content',
      type: textDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: '0uE8EJCVIAD',
      alias: null,
      sourceModelId: Id.PostMeta,
      targetModelId: Id.Post,
      type: belongsToType(),
      foreignKey: null,
    },
  ],
}

const postTag: Model = {
  id: Id.PostTag,
  name: 'post tag',
  softDelete: false,
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: 'wGszJWpxTPh',
      name: 'post id',
      type: bigIntDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
    {
      id: 'YlgLSgY8Skr',
      name: 'tag id',
      type: bigIntDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: '6Uh5opGS8LM',
      alias: null,
      sourceModelId: Id.PostTag,
      targetModelId: Id.Post,
      type: belongsToType(),
      foreignKey: null,
    },
    {
      id: 'xCR4XtTuYjT',
      alias: null,
      sourceModelId: Id.PostTag,
      targetModelId: Id.Tag,
      type: belongsToType(),
      foreignKey: null,
    },
  ],
}

const tag: Model = {
  id: Id.Tag,
  name: 'tag',
  softDelete: false,
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: 'FshuF93yknb',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
    {
      id: '8x7OAEK9LjG',
      name: 'title',
      type: stringDataType({ length: 75 }),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: 'M2LEr5WWtYq',
      name: 'meta title',
      type: stringDataType({ length: 100 }),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'ePkkPVQvLF5',
      name: 'slug',
      type: stringDataType({ length: 100 }),
      primaryKey: false,
      required: true,
      unique: true,
    },
    {
      id: 'eC71J1JAiW5',
      name: 'content',
      type: textDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: 'Ch1tFcak4kC',
      alias: null,
      sourceModelId: Id.Tag,
      targetModelId: Id.PostTag,
      type: hasManyType(),
      foreignKey: null,
    },
    {
      id: 'zUJ6zJEZ_TB',
      alias: null,
      sourceModelId: Id.Tag,
      targetModelId: Id.Post,
      type: {
        type: 'MANY_TO_MANY',
        through: { type: 'THROUGH_MODEL', modelId: Id.PostTag },
        targetFk: null,
      },
      foreignKey: null,
    },
  ],
}

const user: Model = {
  id: Id.User,
  name: 'user',
  softDelete: false,
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: 'qjr5fhyBQJk',
      name: 'id',
      type: bigIntDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
    {
      id: 'QpCuohYW2Hs',
      name: 'first name',
      type: stringDataType({ length: 50 }),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: '4XJNERwnZG5',
      name: 'middle name',
      type: stringDataType({ length: 50 }),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'zG96hHN_eh2',
      name: 'last name',
      type: stringDataType({ length: 50 }),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: '8fYf5Z9TdLb',
      name: 'mobile',
      type: stringDataType({ length: 15 }),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'fKxR-4rs0UV',
      name: 'email',
      type: stringDataType({ length: 50 }),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'rcsZ85LnFsf',
      name: 'password hash',
      type: stringDataType({ length: 32 }),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'uHB2pNmoPGS',
      name: 'registered at',
      type: dateTimeDataType({ defaultNow: true }),
      primaryKey: false,
      required: true,
      unique: false,
    },
    {
      id: '_MA5Jrs0QRM',
      name: 'last login',
      type: dateTimeDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'tOGxTjl7N8V',
      name: 'intro',
      type: textDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
    {
      id: 'X2g0Pw8QFq1',
      name: 'profile',
      type: textDataType(),
      primaryKey: false,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: 'pbNmGR7mt4P',
      alias: null,
      sourceModelId: Id.User,
      targetModelId: Id.Post,
      type: hasManyType(),
      foreignKey: 'author id',
    },
  ],
}

export const blogV1_0_1: SchemaV1 = {
  id: 'akwgxGmESSK',
  name: 'blog',
  createdAt: time,
  updatedAt: time,
  forkedFrom: null,
  models: [category, post, postCategory, postComment, postMeta, postTag, tag, user],
}
