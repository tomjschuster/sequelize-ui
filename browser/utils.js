'use strict'

export const getInitialModel = () => {
  return {
   name: '',
   fields: [],
   config: {
     tableName: '',
     singular: '',
     plural: '',
     timestamps: true,
     freezeTableName: false,
     underscored: false,
     underscoredAll: false
   },
   methods: {
     hooks: false,
     getterMethods: false,
     setterMethods: false,
     instanceMethods: false,
     classMethods: false
   },
   associations: []
 }
}

export const copyModel = model => {
  let fields = [...model.fields]
  let config = Object.assign({}, model.config)
  let methods = Object.assign({}, model.methods)
  let associations = [...model.associations]
  return Object.assign({}, model, {fields, methods, config, associations})
}
const convertFields = fields => {
  return `Fields: ${fields.map(({name}) => name).join(', ')}`
}

const convertAssociations = associations => {
  let unique = []
  associations.forEach(association => {
    if (unique.indexOf(association.target) === -1) unique.push(association.target)
  })
  return `Associations: ${unique.join(', ')}`
}

export const modelSummary = ({fields, associations}) => {
  let output = []
  if (fields.length) output.push(convertFields(fields))
  if (associations.length) output.push(convertAssociations(associations))
  return output.join(' \t')
  }
