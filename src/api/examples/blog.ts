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
  AssociationTypeType,
  belongsToType,
  bigIntDataType,
  booleanDataType,
  dateTimeDataType,
  hasManyType,
  Model,
  Schema,
  stringDataType,
  textDataType,
  ThroughType,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import shortid from 'shortid'
import { BLOG_ID } from './ids'

const time = fromParts(2021, 4, 1)

const Id = {
  Category: shortid(),
  Post: shortid(),
  PostCategory: shortid(),
  PostComment: shortid(),
  PostMeta: shortid(),
  PostTag: shortid(),
  Tag: shortid(),
  User: shortid(),
} as const

const category: Model = {
  id: Id.Category,
  name: 'category',
  createdAt: time,
  updatedAt: time,
  fields: [
    { id: shortid(), name: 'id', type: bigIntDataType(), primaryKey: true },
    { id: shortid(), name: 'title', type: stringDataType({ length: 75 }), required: true },
    { id: shortid(), name: 'meta title', type: stringDataType({ length: 100 }) },
    {
      id: shortid(),
      name: 'slug',
      type: stringDataType({ length: 100 }),
      required: true,
      unique: true,
    },
    { id: shortid(), name: 'content', type: textDataType() },
  ],
  associations: [
    {
      id: shortid(),
      alias: 'parent',
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      type: belongsToType(),
    },
    {
      id: shortid(),
      alias: 'children',
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      type: hasManyType(),
    },
    {
      id: shortid(),
      sourceModelId: Id.Category,
      targetModelId: Id.PostCategory,
      type: hasManyType(),
    },
    {
      id: shortid(),
      sourceModelId: Id.Category,
      targetModelId: Id.Post,
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: Id.PostCategory },
      },
    },
  ],
}

const post: Model = {
  id: Id.Post,
  name: 'post',
  createdAt: time,
  updatedAt: time,
  fields: [
    { id: shortid(), name: 'id', type: bigIntDataType(), primaryKey: true },
    { id: shortid(), name: 'title', type: stringDataType({ length: 75 }), required: true },
    { id: shortid(), name: 'meta title', type: stringDataType({ length: 100 }) },
    {
      id: shortid(),
      name: 'slug',
      type: stringDataType({ length: 100 }),
      required: true,
      unique: true,
    },
    { id: shortid(), name: 'summary', type: textDataType() },
    { id: shortid(), name: 'published', type: booleanDataType(), required: true },
    { id: shortid(), name: 'published at', type: dateTimeDataType() },
    { id: shortid(), name: 'content', type: textDataType() },
  ],
  associations: [
    {
      id: shortid(),
      alias: 'author',
      sourceModelId: Id.Post,
      targetModelId: Id.User,
      type: belongsToType(),
    },
    {
      id: shortid(),
      alias: 'parent',
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: belongsToType(),
    },
    {
      id: shortid(),
      alias: 'children',
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: hasManyType(),
    },
    {
      id: shortid(),
      sourceModelId: Id.Post,
      targetModelId: Id.PostCategory,
      type: hasManyType(),
    },
    {
      id: shortid(),
      sourceModelId: Id.Post,
      targetModelId: Id.Category,
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: Id.PostCategory },
      },
    },
    {
      id: shortid(),
      alias: 'comments',
      sourceModelId: Id.Post,
      targetModelId: Id.PostComment,
      type: hasManyType(),
    },
    {
      id: shortid(),
      alias: 'meta',
      sourceModelId: Id.Post,
      targetModelId: Id.PostMeta,
      type: hasManyType(),
    },
    {
      id: shortid(),
      sourceModelId: Id.Post,
      targetModelId: Id.PostTag,
      type: hasManyType(),
    },
    {
      id: shortid(),
      sourceModelId: Id.Post,
      targetModelId: Id.Tag,
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: Id.PostTag },
      },
    },
  ],
}

const postCategory: Model = {
  id: Id.PostCategory,
  name: 'post category',
  createdAt: time,
  updatedAt: time,
  fields: [
    { id: shortid(), name: 'post id', type: bigIntDataType(), primaryKey: true },
    { id: shortid(), name: 'category id', type: bigIntDataType(), primaryKey: true },
  ],
  associations: [
    {
      id: shortid(),
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Post,
      type: belongsToType(),
    },
    {
      id: shortid(),
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Category,
      type: belongsToType(),
    },
  ],
}

const postComment: Model = {
  id: Id.PostComment,
  name: 'post comment',
  createdAt: time,
  updatedAt: time,
  fields: [
    { id: shortid(), name: 'id', type: bigIntDataType(), primaryKey: true },
    { id: shortid(), name: 'title', type: stringDataType({ length: 75 }), required: true },
    { id: shortid(), name: 'published', type: booleanDataType(), required: true },
    { id: shortid(), name: 'published at', type: dateTimeDataType() },
    { id: shortid(), name: 'content', type: textDataType() },
  ],
  associations: [
    {
      id: shortid(),
      sourceModelId: Id.PostComment,
      targetModelId: Id.Post,
      type: belongsToType(),
    },
    {
      id: shortid(),
      alias: 'parent',
      sourceModelId: Id.PostComment,
      targetModelId: Id.PostComment,
      type: belongsToType(),
    },
    {
      id: shortid(),
      alias: 'children',
      sourceModelId: Id.PostComment,
      targetModelId: Id.PostComment,
      type: hasManyType(),
    },
  ],
}

const postMeta: Model = {
  id: Id.PostMeta,
  name: 'post meta',
  createdAt: time,
  updatedAt: time,
  fields: [
    { id: shortid(), name: 'id', type: bigIntDataType(), primaryKey: true },
    {
      id: shortid(),
      name: 'key',
      type: stringDataType({ length: 50 }),
      required: true,
      unique: true,
    },
    { id: shortid(), name: 'content', type: textDataType() },
  ],
  associations: [
    {
      id: shortid(),
      sourceModelId: Id.PostMeta,
      targetModelId: Id.Post,
      type: belongsToType(),
    },
  ],
}

const postTag: Model = {
  id: Id.PostTag,
  name: 'post tag',
  createdAt: time,
  updatedAt: time,
  fields: [
    { id: shortid(), name: 'post id', type: bigIntDataType(), primaryKey: true },
    { id: shortid(), name: 'tag id', type: bigIntDataType(), primaryKey: true },
  ],
  associations: [
    {
      id: shortid(),
      sourceModelId: Id.PostTag,
      targetModelId: Id.Post,
      type: belongsToType(),
    },
    {
      id: shortid(),
      sourceModelId: Id.PostTag,
      targetModelId: Id.Tag,
      type: belongsToType(),
    },
  ],
}

const tag: Model = {
  id: Id.Tag,
  name: 'tag',
  createdAt: time,
  updatedAt: time,
  fields: [
    { id: shortid(), name: 'id', type: bigIntDataType(), primaryKey: true },
    { id: shortid(), name: 'title', type: stringDataType({ length: 75 }), required: true },
    { id: shortid(), name: 'meta title', type: stringDataType({ length: 100 }) },
    {
      id: shortid(),
      name: 'slug',
      type: stringDataType({ length: 100 }),
      required: true,
      unique: true,
    },
    { id: shortid(), name: 'content', type: textDataType() },
  ],
  associations: [
    {
      id: shortid(),
      sourceModelId: Id.Tag,
      targetModelId: Id.PostTag,
      type: hasManyType(),
    },
    {
      id: shortid(),
      sourceModelId: Id.Tag,
      targetModelId: Id.Post,
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: Id.PostTag },
      },
    },
  ],
}

const user: Model = {
  id: Id.User,
  name: 'user',
  createdAt: time,
  updatedAt: time,
  fields: [
    { id: shortid(), name: 'id', type: bigIntDataType(), primaryKey: true },
    { id: shortid(), name: 'first name', type: stringDataType({ length: 50 }) },
    { id: shortid(), name: 'middle name', type: stringDataType({ length: 50 }) },
    { id: shortid(), name: 'last name', type: stringDataType({ length: 50 }) },
    { id: shortid(), name: 'mobile', type: stringDataType({ length: 15 }) },
    { id: shortid(), name: 'email', type: stringDataType({ length: 50 }) },
    { id: shortid(), name: 'password hash', type: stringDataType({ length: 32 }) },
    {
      id: shortid(),
      name: 'registered at',
      type: dateTimeDataType({ defaultNow: true }),
      required: true,
    },
    { id: shortid(), name: 'last login', type: dateTimeDataType() },
    { id: shortid(), name: 'intro', type: textDataType() },
    { id: shortid(), name: 'profile', type: textDataType() },
  ],
  associations: [
    {
      id: shortid(),
      sourceModelId: Id.User,
      targetModelId: Id.Post,
      type: hasManyType(),
      foreignKey: 'author id',
    },
  ],
}

// https://github.com/tutorials24x7/blog-database-mysql
const blogSchema: Schema = {
  id: BLOG_ID,
  name: 'blog',
  createdAt: time,
  updatedAt: time,
  models: [category, post, postCategory, postComment, postMeta, postTag, tag, user],
}

export default blogSchema
