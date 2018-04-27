import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Input, Checkbox } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */
const Configuration = ({
  // State
  config,
  methods,
  // Actions
  currentModelActions: { updateConfig, updateMethod }
}) => (
  <React.Fragment>
    <h3>Table Options</h3>
    <Input
      label='Table Name'
      value={config.tableName || ''}
      onChange={(_, data) => updateConfig('tableName', data.value)}
    />
    <Input
      label='Singular Name'
      value={config.singular || ''}
      onChange={(_, data) => updateConfig('singular', data.value)}
    />
    <Input
      label='Plural Name'
      value={config.plural || ''}
      onChange={(_, data) => updateConfig('plural', data.checked)}
    />
    <Checkbox
      label='No Timestamp Columns'
      checked={!config.timestamps}
      onChange={(_, data) => updateConfig('timestamps', !data.checked)}
    />
    <Checkbox
      label='Freeze Table Name'
      checked={config.freezeTableName}
      onChange={(_, data) => updateConfig('freezeTableName', data.checked)}
    />
    <Checkbox
      label='Underscore Column Names'
      checked={config.underscored}
      onChange={(_, data) => updateConfig('underscored', data.checked)}
    />
    <Checkbox
      label='Underscore Table Names'
      checked={config.underscoredAll}
      onChange={(_, data) => updateConfig('underscoredAll', data.checked)}
    />
    <h3>Include Templates For:</h3>
    <Checkbox
      label='Hooks'
      checked={methods.hooks}
      onChange={(_, data) => updateMethod('hooks', data.checked)}
    />
    <Checkbox
      label='Getter Methods'
      checked={methods.getterMethods}
      onChange={(_, data) => updateMethod('getterMethods', data.checked)}
    />
    <Checkbox
      label='Setter Methods'
      checked={methods.setterMethods}
      onChange={(_, data) => updateMethod('setterMethods', data.checked)}
    />
    <Checkbox
      label='Instance Methods'
      checked={methods.instanceMethods}
      onChange={(_, data) => updateMethod('instanceMethods', data.checked)}
    />
    <Checkbox
      label='Class Methods'
      checked={methods.classMethods}
      onChange={(_, data) => updateMethod('classMethods', data.checked)}
    />
  </React.Fragment>
)

export default Configuration
