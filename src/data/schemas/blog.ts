import {
  AssociationTypeType,
  bigIntDataType,
  booleanDataType,
  dateTimeDataType,
  Model,
  Schema,
  stringDataType,
  textDataType,
  ThroughType,
} from '@src/core/schema'
import { belongsToType, hasManyType } from '@src/core/schema/__fixtures__/association'
import shortid from 'shortid'

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
      type: belongsToType,
    },
    {
      id: shortid(),
      alias: 'children',
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      type: hasManyType,
    },
    {
      id: shortid(),
      sourceModelId: Id.Category,
      targetModelId: Id.PostCategory,
      type: hasManyType,
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
      type: belongsToType,
    },
    {
      id: shortid(),
      alias: 'parent',
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: belongsToType,
    },
    {
      id: shortid(),
      alias: 'children',
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: hasManyType,
    },
    {
      id: shortid(),
      sourceModelId: Id.Post,
      targetModelId: Id.PostCategory,
      type: hasManyType,
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
      type: hasManyType,
    },
    {
      id: shortid(),
      alias: 'meta',
      sourceModelId: Id.Post,
      targetModelId: Id.PostMeta,
      type: hasManyType,
    },
    {
      id: shortid(),
      sourceModelId: Id.Post,
      targetModelId: Id.PostTag,
      type: hasManyType,
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
  fields: [
    { id: shortid(), name: 'post id', type: bigIntDataType(), primaryKey: true },
    { id: shortid(), name: 'category id', type: bigIntDataType(), primaryKey: true },
  ],
  associations: [
    {
      id: shortid(),
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Post,
      type: belongsToType,
    },
    {
      id: shortid(),
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Category,
      type: belongsToType,
    },
  ],
}

const postComment: Model = {
  id: Id.PostComment,
  name: 'post comment',
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
      type: belongsToType,
    },
    {
      id: shortid(),
      alias: 'parent',
      sourceModelId: Id.PostComment,
      targetModelId: Id.PostComment,
      type: belongsToType,
    },
    {
      id: shortid(),
      alias: 'children',
      sourceModelId: Id.PostComment,
      targetModelId: Id.PostComment,
      type: hasManyType,
    },
  ],
}

const postMeta: Model = {
  id: Id.PostMeta,
  name: 'post meta',
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
      type: belongsToType,
    },
  ],
}

const postTag: Model = {
  id: Id.PostTag,
  name: 'post tag',
  fields: [
    { id: shortid(), name: 'post id', type: bigIntDataType(), primaryKey: true },
    { id: shortid(), name: 'tag id', type: bigIntDataType(), primaryKey: true },
  ],
  associations: [
    {
      id: shortid(),
      sourceModelId: Id.PostTag,
      targetModelId: Id.Post,
      type: belongsToType,
    },
    {
      id: shortid(),
      sourceModelId: Id.PostTag,
      targetModelId: Id.Tag,
      type: belongsToType,
    },
  ],
}

const tag: Model = {
  id: Id.Tag,
  name: 'tag',
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
      type: hasManyType,
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
      type: hasManyType,
    },
  ],
}

// https://github.com/tutorials24x7/blog-database-mysql
export const blogSchema: Schema = {
  id: shortid(),
  name: 'blog',
  models: [category, post, postCategory, postComment, postMeta, postTag, tag, user],
}
