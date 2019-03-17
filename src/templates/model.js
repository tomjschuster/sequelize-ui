import Case from 'case'

export default ({ name, fields = [], config = {} }) =>
  `'use strict';

module.exports = (sequelize, DataTypes) => {
  const ${Case.pascal(name)} = sequelize.define('${name}', {
    ${renderFields(fields, config)}
  }, {
    ${renderOptions(config)}
  });

  ${Case.pascal(name)}.associate = function(models) {
    // associations can be defined here
  };

  return ${Case.pascal(name)};
};
`

const renderFields = (fields, config) =>
  fields.map(field => renderField(field, config)).join(',\n    ')

const renderField = ({ name, dataType }, config) => `${name}: {
      type: DataTypes.${dataType}
    }`

const renderOptions = ({
  snake = false,
  softDeletes = false,
  timestamps = true
}) =>
  `underscored: ${snake}, paranoid: ${softDeletes}, timestamps: ${timestamps}`
