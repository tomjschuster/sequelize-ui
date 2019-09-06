import { DATA_TYPES } from '../constants'

const User = {
  id: 1,
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
      type: DATA_TYPES.String,
      primaryKey: false,
      required: true,
      unique: true
    }
  ],
  assocs: []
}

const Post = {
  id: 2,
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
      id: 1,
      type: 'BELONGS_TO',
      modelId: User.id,
      as: 'Author',
      through: []
    }
  ]
}

const Tag = {
  id: 3,
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
      id: 1,
      type: 'BELONGS_TO',
      modelId: Post.id,
      as: null,
      through: []
    }
  ]
}

const Comment = {
  id: 4,
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
      id: 2,
      type: 'BELONGS_TO',
      modelId: User.id,
      as: 'Author',
      through: []
    },
    {
      id: 3,
      type: 'BELONGS_TO',
      modelId: Post.id,
      as: null,
      through: []
    },
    {
      id: 4,
      type: 'BELONGS_TO',
      modelId: 4, // Self
      as: 'Parent',
      through: []
    }
  ]
}

export const Blog = { models: [Post, User, Tag, Comment] }
