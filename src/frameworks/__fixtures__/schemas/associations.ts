import {
  association,
  belongsToType,
  bigIntDataType,
  field,
  hasManyType,
  manyToManyModelType,
  manyToManyTableType,
  model,
  Model,
  schema,
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

const category: Model = model({
  id: Id.Category,
  name: 'category',
  createdAt: time,
  updatedAt: time,
  associations: [
    association({
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      alias: 'parent',
      type: belongsToType(),
    }),
    association({
      sourceModelId: Id.Category,
      targetModelId: Id.Category,
      alias: 'children',
      type: hasManyType(),
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
  associations: [
    association({
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      alias: 'parent',
      foreignKey: 'parent id',
      type: belongsToType(),
    }),
    association({
      sourceModelId: Id.Post,
      targetModelId: Id.Post,
      alias: 'children',
      type: hasManyType(),
    }),
    association({ sourceModelId: Id.Post, targetModelId: Id.PostCategory, type: hasManyType() }),
    association({
      sourceModelId: Id.Post,
      targetModelId: Id.Category,
      type: manyToManyModelType(Id.PostCategory),
    }),
    association({ sourceModelId: Id.Post, targetModelId: Id.PostTag, type: hasManyType() }),
    association({
      sourceModelId: Id.Post,
      targetModelId: Id.Tag,
      type: manyToManyTableType('post_tag', 'tag_id'),
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
      name: 'post id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
    field({
      name: 'category id',
      type: bigIntDataType(),
      primaryKey: true,
    }),
  ],
  associations: [
    association({ sourceModelId: Id.PostCategory, targetModelId: Id.Post, type: belongsToType() }),
    association({
      sourceModelId: Id.PostCategory,
      targetModelId: Id.Category,
      type: belongsToType(),
    }),
  ],
})

const postTag: Model = model({
  id: Id.PostTag,
  name: 'post tag',
  createdAt: time,
  updatedAt: time,
  associations: [
    association({ sourceModelId: Id.PostTag, targetModelId: Id.Post, type: belongsToType() }),
    association({ sourceModelId: Id.PostTag, targetModelId: Id.Tag, type: belongsToType() }),
  ],
})

const tag: Model = model({
  id: Id.Tag,
  name: 'tag',
  createdAt: time,
  updatedAt: time,
  associations: [
    association({ sourceModelId: Id.Tag, targetModelId: Id.PostTag, type: hasManyType() }),
    association({
      sourceModelId: Id.Tag,
      targetModelId: Id.Post,
      type: manyToManyModelType(Id.PostTag),
    }),
  ],
})

const associationsSchema: Schema = schema({
  name: 'associations',
  createdAt: time,
  updatedAt: time,
  models: [category, post, postCategory, postTag, tag],
})

export default associationsSchema
