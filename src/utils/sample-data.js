import { DATA_TYPES } from '../constants'
import uuid from 'uuid/v4'

const USER_ID = uuid()
const POST_ID = uuid()
const TAG_ID = uuid()
const COMMENT_ID = uuid()

const User = {
  id: USER_ID,
  name: 'User',
  fields: [
    {
      id: uuid(),
      modelId: USER_ID,
      name: 'First Name',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      id: uuid(),
      modelId: USER_ID,
      name: 'Last Name',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      id: uuid(),
      modelId: USER_ID,
      name: 'Email',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: true
    }
  ],
  assocs: [
    {
      id: uuid(),
      type: 'HAS_MANY',
      sourceId: USER_ID,
      targetId: POST_ID,
      name: null,
      through: null,
      foreignKey: 'author id',
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'HAS_MANY',
      sourceId: USER_ID,
      targetId: COMMENT_ID,
      name: null,
      through: null,
      foreignKey: 'author id',
      targetForeignKey: null
    }
  ]
}

const Post = {
  id: POST_ID,
  name: 'Post',
  fields: [
    {
      id: uuid(),
      modelId: POST_ID,
      name: 'Title',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      id: uuid(),
      modelId: POST_ID,
      name: 'Content',
      type: DATA_TYPES.TEXT,
      primaryKey: false,
      required: false,
      unique: false
    }
  ],
  assocs: [
    {
      id: uuid(),
      type: 'BELONGS_TO',
      sourceId: POST_ID,
      targetId: USER_ID,
      name: 'Author',
      through: null,
      foreignKey: null,
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'HAS_MANY',
      sourceId: POST_ID,
      targetId: COMMENT_ID,
      name: null,
      through: null,
      foreignKey: null,
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'MANY_TO_MANY',
      sourceId: POST_ID,
      targetId: TAG_ID,
      name: null,
      through: 'Post Tags',
      foreignKey: null,
      targetForeignKey: null
    }
  ]
}

const Tag = {
  id: TAG_ID,
  name: 'Tag',
  fields: [
    {
      id: uuid(),
      modelId: TAG_ID,
      name: 'Name',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    }
  ],
  assocs: [
    {
      id: uuid(),
      type: 'MANY_TO_MANY',
      sourceId: TAG_ID,
      targetId: POST_ID,
      name: null,
      through: 'Post Tags',
      foreignKey: null,
      targetForeignKey: null
    }
  ]
}

const Comment = {
  id: COMMENT_ID,
  name: 'Comment',
  fields: [
    {
      id: uuid(),
      modelId: COMMENT_ID,
      name: 'Content',
      type: DATA_TYPES.TEXT,
      primaryKey: false,
      required: true,
      unique: false
    }
  ],
  assocs: [
    {
      id: uuid(),
      type: 'BELONGS_TO',
      sourceId: COMMENT_ID,
      targetId: USER_ID,
      name: 'Author',
      through: null,
      foreignKey: null,
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'BELONGS_TO',
      sourceId: COMMENT_ID,
      targetId: POST_ID,
      name: null,
      through: null,
      foreignKey: null,
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'BELONGS_TO',
      sourceId: COMMENT_ID,
      targetId: COMMENT_ID,
      name: 'Parent',
      through: null,
      foreignKey: null,
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'HAS_MANY',
      sourceId: COMMENT_ID,
      targetId: COMMENT_ID,
      name: 'Response',
      through: null,
      foreignKey: 'parent id',
      targetForeignKey: null
    }
  ]
}

export const Blog = { models: [Post, User, Tag, Comment] }
