import React from 'react'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import Checkbox from 'react-toolbox/lib/checkbox'
import Input from 'react-toolbox/lib/input'

/*----------  COMPONENT  ----------*/
const Configuration = ({ currentModel, updateConfig, updateMethod }) => (
  <div>
    <h3>Table Options</h3>
    <Input
      label="Table Name"
      value={currentModel.config.tableName}
      onChange={updateConfig.bind(null, 'tableName')}
    />
    <Input
      label="Singular Name"
      value={currentModel.config.singular}
      onChange={updateConfig.bind(null, 'singular')}
    />
    <Input
      label="Plural Name"
      value={currentModel.config.plural}
      onChange={updateConfig.bind(null, 'plural')}
    />
    <Checkbox
      label="No Timestamp Columns"
      checked={!currentModel.config.timestamps}
      onChange={updateConfig.bind(
        null,
        'timestamps',
        !currentModel.config.timestamps
      )}
    />
    <Checkbox
      label="Freeze Table Name"
      checked={currentModel.config.freezeTableName}
      onChange={updateConfig.bind(null, 'freezeTableName')}
    />
    <Checkbox
      label="Underscore Column Names"
      checked={currentModel.config.underscored}
      onChange={updateConfig.bind(null, 'underscored')}
    />
    <Checkbox
      label="Underscore Table Names"
      checked={currentModel.config.underscoredAll}
      onChange={updateConfig.bind(null, 'underscoredAll')}
    />
    <h3>Include Templates For:</h3>
    <Checkbox
      label="Hooks"
      checked={currentModel.methods.hooks}
      onChange={updateMethod.bind(null, 'hooks')}
    />
    <Checkbox
      label="Getter Methods"
      checked={currentModel.methods.getterMethods}
      onChange={updateMethod.bind(null, 'getterMethods')}
    />
    <Checkbox
      label="Setter Methods"
      checked={currentModel.methods.setterMethods}
      onChange={updateMethod.bind(null, 'setterMethods')}
    />
    <Checkbox
      label="Instance Methods"
      checked={currentModel.methods.instanceMethods}
      onChange={updateMethod.bind(null, 'instanceMethods')}
    />
    <Checkbox
      label="Class Methods"
      checked={currentModel.methods.classMethods}
      onChange={updateMethod.bind(null, 'classMethods')}
    />
  </div>
)

export default Configuration
