import { DATA_TYPES } from '../constants'

const Post = {
  name: 'Post',
  fields: [
    {
      name: 'Title',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      name: 'Content',
      type: DATA_TYPES.TEXT,
      primaryKey: false,
      required: false,
      unique: false
    },
    {
      name: 'Author ID',
      type: DATA_TYPES.INTEGER,
      primaryKey: false,
      required: true,
      unique: false
    }
  ]
}

const User = {
  name: 'User',
  fields: [
    {
      name: 'First Name',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      name: 'Last Name',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      name: 'Email',
      type: DATA_TYPES.String,
      primaryKey: false,
      required: true,
      unique: true
    }
  ]
}

const Tag = {
  name: 'Tag',
  fields: [
    {
      name: 'Post ID',
      type: DATA_TYPES.INTEGER,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      name: 'Name',
      type: DATA_TYPES.STRING,
      primaryKey: false,
      required: true,
      unique: false
    }
  ]
}

const Comment = {
  name: 'Comment',
  fields: [
    {
      name: 'Author ID',
      type: DATA_TYPES.INTEGER,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      name: 'Post ID',
      type: DATA_TYPES.INTEGER,
      primaryKey: false,
      required: true,
      unique: false
    },
    {
      name: 'Parent ID',
      type: DATA_TYPES.INTEGER,
      primaryKey: false,
      required: false,
      unique: false
    },
    {
      name: 'Content',
      type: DATA_TYPES.TEXT,
      primaryKey: false,
      required: true,
      unique: false
    }
  ]
}

export const Blog = {models: [Post, User, Tag, Comment]}
