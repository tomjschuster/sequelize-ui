import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Input, Checkbox } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */
export const CONFIG_DISPLAY = {
  tableName: 'Table Name',
  singular: 'Singular Name',
  plural: 'Plura Name',
  timestamps: 'Timestamp Columns',
  freezeTableName: 'Freeze Table Name',
  underscored: 'Underscore Column Names',
  hooks: 'Hooks',
  getterMethods: 'Getter Methods',
  setterMethods: 'Setter Methods',
  instanceMethods: 'Instance Methods',
  classMethods: 'Class Methods'
}

class Configuration extends React.Component {
  renderInput = (key) => {
    const { config, currentModelActions: { updateConfig } } = this.props
    return (
      <Input
        key={key}
        label={CONFIG_DISPLAY[key]}
        value={config[key] || ''}
        onChange={(_, data) => updateConfig(key, data.value)}
      />
    )
  }

  renderCheckbox = (key, negate) => {
    const { config, currentModelActions: { updateConfig } } = this.props
    return (
      <Checkbox
        key={key}
        label={negate ? `No ${CONFIG_DISPLAY[key]}` : CONFIG_DISPLAY[key]}
        checked={negate ? !config[key] : config[key]}
        onChange={(_, data) => updateConfig(key, negate ? !data.checked : data.checked)}
      />
    )
  }

  renderMethodCheckbox = (key) => {
    const { methods, currentModelActions: { updateMethod } } = this.props
    return (
      <Checkbox
        key={key}
        label={CONFIG_DISPLAY[key]}
        checked={methods[key]}
        onChange={(_, data) => updateMethod(key, data.checked)}
      />
    )
  }

  renderInputs = () => {
    const keys = ['tableName', 'singular', 'plural']
    return keys.map(this.renderInput)
  }

  renderCheckboxes = () => {
    const keys = [
      {key: 'timestamps', negate: true},
      {key: 'freezeTableName', negate: false},
      {key: 'underscored', negate: false}
    ]

    return keys.map(({ key, negate }) => this.renderCheckbox(key, negate))
  }

  renderMethodCheckboxes = () => {
    const keys = [
      'hooks',
      'getterMethods',
      'setterMethods',
      'instanceMethods',
      'classMethods'
    ]

    return keys.map(this.renderMethodCheckbox)
  }

  render () {
    return (
      <React.Fragment>
        <h3>Table Options</h3>
        {this.renderInputs()}
        {this.renderCheckboxes()}
        {this.renderMethodCheckboxes()}
      </React.Fragment>
    )
  }
}

export default Configuration
