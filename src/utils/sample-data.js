import { DATA_TYPES } from '../constants'

const USER_ID = 1
const POST_ID = 2
const TAG_ID = 3
const COMMENT_ID = 4

const User = {
  id: USER_ID,
  name: 'User',
  fields: [
    {
      id: 1,
      name: 'First Name',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      id: 2,
      name: 'Last Name',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      id: 3,
      name: 'Email',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: true
    }
  ],
  assocs: [
    {
      id: 1,
      type: 'HAS_MANY',
      modelId: POST_ID,
      as: null,
      through: []
    },
    {
      id: 2,
      type: 'HAS_MANY',
      modelId: COMMENT_ID,
      as: null,
      through: []
    }
  ]
}

const Post = {
  id: POST_ID,
  name: 'Post',
  fields: [
    {
      id: 4,
      name: 'Title',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      id: 5,
      name: 'Content',
      type: DATA_TYPES.TEXT,
      primaryKey: false,
      required: false,
      unique: false
    }
  ],
  assocs: [
    {
      id: 3,
      type: 'BELONGS_TO',
      modelId: USER_ID,
      as: 'Author',
      through: []
    },
    {
      id: 4,
      type: 'HAS_MANY',
      modelId: COMMENT_ID,
      as: null,
      through: []
    },
    {
      id: 5,
      type: 'MANY_TO_MANY',
      modelId: TAG_ID,
      as: null,
      through: []
    }
  ]
}

const Tag = {
  id: TAG_ID,
  name: 'Tag',
  fields: [
    {
      id: 6,
      name: 'Name',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    }
  ],
  assocs: [
    {
      id: 6,
      type: 'MANY_TO_MANY',
      modelId: POST_ID,
      as: null,
      through: []
    }
  ]
}

const Comment = {
  id: COMMENT_ID,
  name: 'Comment',
  fields: [
    {
      id: 7,
      name: 'Content',
      type: DATA_TYPES.TEXT,
      primaryKey: false,
      required: true,
      unique: false
    }
  ],
  assocs: [
    {
      id: 7,
      type: 'BELONGS_TO',
      modelId: USER_ID,
      as: 'Author',
      through: []
    },
    {
      id: 8,
      type: 'BELONGS_TO',
      modelId: POST_ID,
      as: null,
      through: []
    },
    {
      id: 9,
      type: 'BELONGS_TO',
      modelId: COMMENT_ID,
      as: 'Parent',
      through: []
    },
    {
      id: 10,
      type: 'HAS_MANY',
      modelId: COMMENT_ID,
      as: 'Response',
      through: []
    }
  ]
}

export const Blog = { models: [Post, User, Tag, Comment] }
