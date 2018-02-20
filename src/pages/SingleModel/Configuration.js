import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Checkbox from 'react-toolbox/lib/checkbox'
import Input from 'react-toolbox/lib/input'

/* ----------  COMPONENT  ---------- */
const Configuration = ({
  // State
  config,
  methods,
  // Actions
  currentModelActions: { updateConfig, updateMethod }
}) => (
  <div>
    <h3>Table Options</h3>
    <Input
      label='Table Name'
      value={config.tableName}
      onChange={updateConfig.bind(null, 'tableName')}
    />
    <Input
      label='Singular Name'
      value={config.singular}
      onChange={updateConfig.bind(null, 'singular')}
    />
    <Input
      label='Plural Name'
      value={config.plural}
      onChange={updateConfig.bind(null, 'plural')}
    />
    <Checkbox
      label='No Timestamp Columns'
      checked={!config.timestamps}
      onChange={updateConfig.bind(null, 'timestamps', !config.timestamps)}
    />
    <Checkbox
      label='Freeze Table Name'
      checked={config.freezeTableName}
      onChange={updateConfig.bind(null, 'freezeTableName')}
    />
    <Checkbox
      label='Underscore Column Names'
      checked={config.underscored}
      onChange={updateConfig.bind(null, 'underscored')}
    />
    <Checkbox
      label='Underscore Table Names'
      checked={config.underscoredAll}
      onChange={updateConfig.bind(null, 'underscoredAll')}
    />
    <h3>Include Templates For:</h3>
    <Checkbox
      label='Hooks'
      checked={methods.hooks}
      onChange={updateMethod.bind(null, 'hooks')}
    />
    <Checkbox
      label='Getter Methods'
      checked={methods.getterMethods}
      onChange={updateMethod.bind(null, 'getterMethods')}
    />
    <Checkbox
      label='Setter Methods'
      checked={methods.setterMethods}
      onChange={updateMethod.bind(null, 'setterMethods')}
    />
    <Checkbox
      label='Instance Methods'
      checked={methods.instanceMethods}
      onChange={updateMethod.bind(null, 'instanceMethods')}
    />
    <Checkbox
      label='Class Methods'
      checked={methods.classMethods}
      onChange={updateMethod.bind(null, 'classMethods')}
    />
  </div>
)

export default Configuration
