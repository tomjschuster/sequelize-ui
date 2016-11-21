'use strict';

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
 };
};

export const copyModel = model => {
  let fields = [...model.fields];
  let config = Object.assign({}, model.config);
  let methods = Object.assign({}, model.methods);
  let associations = [...model.associations];
  return Object.assign({}, model, {fields, methods, config, associations});
};

export const convertFields = fields => {
  let output = '';
  for (let field of fields) output += field.name + ', ';
  return output.slice(0, -2);
};
