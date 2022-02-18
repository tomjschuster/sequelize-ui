import {
  belongsToType,
  bigIntDataType,
  hasManyType,
  manyToManyModelType,
  manyToManyTableType,
  Model,
  Schema,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import { uniqueId } from '@src/utils/string'

const time = fromParts(2021, 7, 1)

const Id = {
  Category: uniqueId(),
  Post: uniqueId(),
  PostCategory: uniqueId(),
  PostTag: uniqueId(),
  Tag: uniqueId(),
} as const

const category: Model = {
  id: Id.Category,
  name: 'category',
  createdAt: time,
  updatedAt: time,
  fields: [],
  associations: [
    {
      id: uniqueId(),
      alias: 'parent',
      foreignKey: null,
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      type: belongsToType(),
    },
    {
      id: uniqueId(),
      alias: 'children',
      foreignKey: null,
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      type: hasManyType(),
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      sourceModelId: Id.Category,
      targetModelId: Id.PostCategory,
      type: hasManyType(),
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      sourceModelId: Id.Category,
      targetModelId: Id.Post,
      type: manyToManyModelType(Id.PostCategory),
    },
  ],
}

const post: Model = {
  id: Id.Post,
  name: 'post',
  createdAt: time,
  updatedAt: time,
  fields: [],
  associations: [
    {
      id: uniqueId(),
      alias: 'parent',
      foreignKey: 'parent id',
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: belongsToType(),
    },
    {
      id: uniqueId(),
      alias: 'children',
      foreignKey: null,
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      type: hasManyType(),
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      sourceModelId: Id.Post,
      targetModelId: Id.PostCategory,
      type: hasManyType(),
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      sourceModelId: Id.Post,
      targetModelId: Id.Category,
      type: manyToManyModelType(Id.PostCategory),
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      sourceModelId: Id.Post,
      targetModelId: Id.PostTag,
      type: hasManyType(),
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      sourceModelId: Id.Post,
      targetModelId: Id.Tag,
      type: manyToManyTableType('post_tag', 'tag_id'),
    },
  ],
}

const postCategory: Model = {
  id: Id.PostCategory,
  name: 'post category',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: uniqueId(),
      name: 'post id',
      type: bigIntDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
    {
      id: uniqueId(),
      name: 'category id',
      type: bigIntDataType(),
      primaryKey: true,
      required: false,
      unique: false,
    },
  ],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Post,
      type: belongsToType(),
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Category,
      type: belongsToType(),
    },
  ],
}

const postTag: Model = {
  id: Id.PostTag,
  name: 'post tag',
  createdAt: time,
  updatedAt: time,
  fields: [],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      sourceModelId: Id.PostTag,
      targetModelId: Id.Post,
      type: belongsToType(),
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
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
  fields: [],
  associations: [
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      sourceModelId: Id.Tag,
      targetModelId: Id.PostTag,
      type: hasManyType(),
    },
    {
      id: uniqueId(),
      alias: null,
      foreignKey: null,
      sourceModelId: Id.Tag,
      targetModelId: Id.Post,
      type: manyToManyModelType(Id.PostTag),
    },
  ],
}

const associationsSchema: Schema = {
  id: uniqueId(),
  createdAt: time,
  updatedAt: time,
  name: 'associations',
  forkedFrom: null,
  models: [category, post, postCategory, postTag, tag],
}

export default associationsSchema
