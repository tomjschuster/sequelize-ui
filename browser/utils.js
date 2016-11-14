
const getInitialDialogs = () => {
  return {
    confirm: {
      open: false,
      title: '',
      message: ''
    }
  };
};

export const getInitialModel = () => {
  return { idx: -1,
           name: '',
           fields: [],
           config: {
             tableName: '',
             singular: '',
             plural: '',
             timestamps: true,
             freezeTableNames: false,
             underscored: false,
             underscoredAll: false
           },
           methods: {
             hooks: false,
             getterMethods: false,
             setterMethods: false,
             instanceMethods: false,
             classMethods: false
           }
         };
};

export const getInitialState = () => {
  let model = getInitialModel();
  let dialogs = getInitialDialogs();
  return {model, dialogs, selectedIdx: null, expandedFields: []};
};

export const makeDialogState = (key, open, title, message) => {
  let state = {};
  state[key] = {};
  state[key].open = open;
  state[key].title = title;
  state[key].message = message;
  return state;
};

export const messages = {
  reqModelName: 'Please give your model a name.',
  reqFieldName: 'Every field must have a name.',
  reqFieldType: 'Every field must have a data type.',
  dupFieldName: 'Table name already exists. Please select another name.',
};

export const convertFields = fields => {
  let output = '';
  for (let field of fields) output += field.name + ', ';
  return output.slice(0, -2);
};
