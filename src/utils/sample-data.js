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
      name: 'First Name',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      id: uuid(),
      name: 'Last Name',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      id: uuid(),
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
      modelId: POST_ID,
      name: null,
      through: null,
      foreignKey: 'author id',
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'HAS_MANY',
      modelId: COMMENT_ID,
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
      name: 'Title',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      id: uuid(),
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
      modelId: USER_ID,
      name: 'Author',
      through: null,
      foreignKey: null,
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'HAS_MANY',
      modelId: COMMENT_ID,
      name: null,
      through: null,
      foreignKey: null,
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'MANY_TO_MANY',
      modelId: TAG_ID,
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
      modelId: POST_ID,
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
      modelId: USER_ID,
      name: 'Author',
      through: null,
      foreignKey: null,
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'BELONGS_TO',
      modelId: POST_ID,
      name: null,
      through: null,
      foreignKey: null,
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'BELONGS_TO',
      modelId: COMMENT_ID,
      name: 'Parent',
      through: null,
      foreignKey: null,
      targetForeignKey: null
    },
    {
      id: uuid(),
      type: 'HAS_MANY',
      modelId: COMMENT_ID,
      name: 'Response',
      through: null,
      foreignKey: 'parent id',
      targetForeignKey: null
    }
  ]
}

export const Blog = { models: [Post, User, Tag, Comment] }
