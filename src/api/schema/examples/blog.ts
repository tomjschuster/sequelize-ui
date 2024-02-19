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
  association,
  belongsToType,
  booleanDataType,
  dateTimeDataType,
  field,
  hasManyType,
  manyToManyModelType,
  model,
  Model,
  schema,
  Schema,
  stringDataType,
  textDataType,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import { BLOG_ID } from './ids'

const time = fromParts(2021, 4, 1)

enum Id {
  Category = 'Xo4oKmkLNHD4Xg1D2AY1e',
  Post = 'lPlVbtl-FUggStKQSxXxA',
  PostCategory = 'AKpWI3wUUAC7LdqfmTmKh',
  PostComment = 'dKGfmE5UiQZvpNY2JOrN9',
  PostMeta = 'hS-D7bIrFW-BuyVjqVWiX',
  PostTag = 'USuYXCnn6PdTmxw0eN_Jt',
  Tag = 'ZkLt52OdJUx9_g1_d_uu1',
  User = '6XfrfnVeY7KTKukt26dQZ',
}

const category: Model = model({
  id: Id.Category,
  name: 'category',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'title',
      type: stringDataType({ length: 75 }),
      required: true,
    }),
    field({
      name: 'meta title',
      type: stringDataType({ length: 100 }),
    }),
    field({
      name: 'slug',
      type: stringDataType({ length: 100 }),
      required: true,
      unique: true,
    }),
    field({
      name: 'content',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
      alias: 'parent',
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      type: belongsToType(),
    }),
    association({
      alias: 'children',
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      type: hasManyType(),
      foreignKey: 'parent id',
    }),
    association({
      sourceModelId: Id.Category,
      targetModelId: Id.PostCategory,
      type: hasManyType(),
    }),
    association({
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
      name: 'title',
      type: stringDataType({ length: 75 }),
      required: true,
    }),
    field({
      name: 'meta title',
      type: stringDataType({ length: 100 }),
    }),
    field({
      name: 'slug',
      type: stringDataType({ length: 100 }),
      required: true,
      unique: true,
    }),
    field({
      name: 'summary',
      type: textDataType(),
    }),
    field({
      name: 'published',
      type: booleanDataType(),
      required: true,
    }),
    field({
      name: 'published at',
      type: dateTimeDataType(),
    }),
    field({
      name: 'content',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
      alias: 'author',
      sourceModelId: Id.Post,
      targetModelId: Id.User,
      type: belongsToType(),
    }),
    association({
      alias: 'parent',
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: belongsToType(),
    }),
    association({
      alias: 'children',
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: hasManyType(),
      foreignKey: 'parent id',
    }),
    association({
      sourceModelId: Id.Post,
      targetModelId: Id.PostCategory,
      type: hasManyType(),
    }),
    association({
      sourceModelId: Id.Post,
      targetModelId: Id.Category,
      type: manyToManyModelType(Id.PostCategory),
    }),
    association({
      alias: 'comments',
      sourceModelId: Id.Post,
      targetModelId: Id.PostComment,
      type: hasManyType(),
    }),
    association({
      alias: 'meta',
      sourceModelId: Id.Post,
      targetModelId: Id.PostMeta,
      type: hasManyType(),
    }),
    association({
      sourceModelId: Id.Post,
      targetModelId: Id.PostTag,
      type: hasManyType(),
    }),
    association({
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
  fields: [],
  associations: [
    association({
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Post,
      type: belongsToType(),
    }),
    association({
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
      name: 'title',
      type: stringDataType({ length: 75 }),
      required: true,
    }),
    field({
      name: 'published',
      type: booleanDataType(),
      required: true,
    }),
    field({
      name: 'published at',
      type: dateTimeDataType(),
    }),
    field({
      name: 'content',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
      sourceModelId: Id.PostComment,
      targetModelId: Id.Post,
      type: belongsToType(),
    }),
    association({
      alias: 'parent',
      sourceModelId: Id.PostComment,
      targetModelId: Id.PostComment,
      type: belongsToType(),
    }),
    association({
      alias: 'children',
      sourceModelId: Id.PostComment,
      targetModelId: Id.PostComment,
      type: hasManyType(),
      foreignKey: 'parent id',
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
      name: 'key',
      type: stringDataType({ length: 50 }),
      required: true,
      unique: true,
    }),
    field({
      name: 'content',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
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
  fields: [],
  associations: [
    association({
      sourceModelId: Id.PostTag,
      targetModelId: Id.Post,
      type: belongsToType(),
    }),
    association({
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
      name: 'title',
      type: stringDataType({ length: 75 }),
      required: true,
    }),
    field({
      name: 'meta title',
      type: stringDataType({ length: 100 }),
    }),
    field({
      name: 'slug',
      type: stringDataType({ length: 100 }),
      required: true,
      unique: true,
    }),
    field({
      name: 'content',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
      sourceModelId: Id.Tag,
      targetModelId: Id.PostTag,
      type: hasManyType(),
    }),
    association({
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
      name: 'first name',
      type: stringDataType({ length: 50 }),
    }),
    field({
      name: 'middle name',
      type: stringDataType({ length: 50 }),
    }),
    field({
      name: 'last name',
      type: stringDataType({ length: 50 }),
    }),
    field({
      name: 'mobile',
      type: stringDataType({ length: 15 }),
    }),
    field({
      name: 'email',
      type: stringDataType({ length: 50 }),
    }),
    field({
      name: 'password hash',
      type: stringDataType({ length: 32 }),
    }),
    field({
      name: 'registered at',
      type: dateTimeDataType({ defaultNow: true }),
      required: true,
    }),
    field({
      name: 'last login',
      type: dateTimeDataType(),
    }),
    field({
      name: 'intro',
      type: textDataType(),
    }),
    field({
      name: 'profile',
      type: textDataType(),
    }),
  ],
  associations: [
    association({
      sourceModelId: Id.User,
      targetModelId: Id.Post,
      type: hasManyType(),
      foreignKey: 'author id',
    }),
  ],
})

const blogSchema: Schema = schema({
  id: BLOG_ID,
  name: 'blog',
  createdAt: time,
  updatedAt: time,
  models: [category, post, postCategory, postComment, postMeta, postTag, tag, user],
})

export default blogSchema
