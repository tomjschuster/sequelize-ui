import {
  association,
  belongsToType,
  field,
  hasManyType,
  manyToManyTableType,
  model,
  schema,
  Schema,
  stringDataType,
  textDataType,
} from '@src/core/schema'

export const blogTranslatedFromLegacy: Schema = schema({
  name: 'Blog',
  models: [
    model({
      id: 'e656d286-e249-4844-ab0a-f4bb6ae8c44f',
      name: 'Post',
      fields: [
        field({
          id: 'a6379f06-4ea5-4462-9b89-54ad60a2bc96',
          name: 'Title',
          type: stringDataType(),
          required: true,
        }),
        field({
          id: '4c299161-38de-48b2-bab8-ccf451188344',
          name: 'Content',
          type: textDataType(),
        }),
      ],
      associations: [
        association({
          id: '265bd2a1-04ba-4ca3-9e21-60a23b77ea38',
          type: belongsToType(),
          sourceModelId: 'e656d286-e249-4844-ab0a-f4bb6ae8c44f',
          targetModelId: '55dded8d-6b6a-401f-a799-d10ce03296e9',
          alias: 'Author',
        }),
        association({
          id: '7bd0f700-bf8d-4fa6-bab2-338c0d6f3969',
          type: hasManyType(),
          sourceModelId: 'e656d286-e249-4844-ab0a-f4bb6ae8c44f',
          targetModelId: 'f38d213b-3317-402a-9702-7d37c1cc03cb',
        }),
        association({
          id: '6b8ee99f-eac3-48bc-90e9-db5da71de988',
          type: manyToManyTableType('Post Tags'),
          sourceModelId: 'e656d286-e249-4844-ab0a-f4bb6ae8c44f',
          targetModelId: '8c934d50-a8aa-4ea5-bf99-e3f5de6d6af5',
        }),
      ],
    }),
    model({
      id: '55dded8d-6b6a-401f-a799-d10ce03296e9',
      name: 'User',
      fields: [
        field({
          id: '41edff74-ace8-4f17-a297-c3bce0968f44',
          name: 'First Name',
          type: stringDataType(),
          required: true,
        }),
        field({
          id: '12e09a2e-d370-48bf-ab8a-0072708170b7',
          name: 'Last Name',
          type: stringDataType(),
          required: true,
        }),
        field({
          id: '0ddb0f8e-0a2f-413e-b2f2-d6bb5bdc8a84',
          name: 'Email',
          type: stringDataType(),
          required: true,
          unique: true,
        }),
      ],
      associations: [
        association({
          id: '6ab58e40-b888-4b3a-8f24-3e26ccefeeab',
          type: hasManyType(),
          sourceModelId: '55dded8d-6b6a-401f-a799-d10ce03296e9',
          targetModelId: 'e656d286-e249-4844-ab0a-f4bb6ae8c44f',
          foreignKey: 'author id',
        }),
        association({
          id: '7241057f-cbd8-45bc-a766-857dded9ec48',
          type: hasManyType(),
          sourceModelId: '55dded8d-6b6a-401f-a799-d10ce03296e9',
          targetModelId: 'f38d213b-3317-402a-9702-7d37c1cc03cb',
          foreignKey: 'author id',
        }),
      ],
    }),
    model({
      id: '8c934d50-a8aa-4ea5-bf99-e3f5de6d6af5',
      name: 'Tag',
      fields: [
        field({
          id: '16e49434-2904-46b6-bc6c-68860c15a856',
          name: 'Name',
          type: stringDataType(),
          required: true,
        }),
      ],
      associations: [
        association({
          id: '7169d0cb-1982-45df-a243-71fc539b7e7e',
          type: manyToManyTableType('Post Tags'),
          sourceModelId: '8c934d50-a8aa-4ea5-bf99-e3f5de6d6af5',
          targetModelId: 'e656d286-e249-4844-ab0a-f4bb6ae8c44f',
        }),
      ],
    }),
    model({
      id: 'f38d213b-3317-402a-9702-7d37c1cc03cb',
      name: 'Comment',
      fields: [
        field({
          id: '60ee41cc-7d56-4835-8ea4-70274fab7c4d',
          name: 'Content',
          type: textDataType(),
          required: true,
        }),
      ],
      associations: [
        association({
          id: '76acd309-c7d6-42bb-a390-9479b4edf688',
          type: belongsToType(),
          sourceModelId: 'f38d213b-3317-402a-9702-7d37c1cc03cb',
          targetModelId: '55dded8d-6b6a-401f-a799-d10ce03296e9',
          alias: 'Author',
        }),
        association({
          id: '36a00526-bc28-4553-b0db-b12428bf70bf',
          type: belongsToType(),
          sourceModelId: 'f38d213b-3317-402a-9702-7d37c1cc03cb',
          targetModelId: 'e656d286-e249-4844-ab0a-f4bb6ae8c44f',
        }),
        association({
          id: '209d5e91-7d2b-4d71-9756-3934e7349d02',
          type: belongsToType(),
          sourceModelId: 'f38d213b-3317-402a-9702-7d37c1cc03cb',
          targetModelId: 'f38d213b-3317-402a-9702-7d37c1cc03cb',
          alias: 'Parent',
        }),
        association({
          id: '61f32047-c929-4472-a6ea-2c8e5f1085b9',
          type: hasManyType(),
          sourceModelId: 'f38d213b-3317-402a-9702-7d37c1cc03cb',
          targetModelId: 'f38d213b-3317-402a-9702-7d37c1cc03cb',
          alias: 'Response',
          foreignKey: 'parent id',
        }),
      ],
    }),
  ],
})
