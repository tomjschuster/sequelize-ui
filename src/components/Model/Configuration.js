import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Input, Checkbox } from 'semantic-ui-react'

/* ----------  CONSTANTS  ---------- */
import { METHODS, OPTIONS, displayMethod, displayOption } from '../../constants'

/* ----------  COMPONENT  ---------- */
class Configuration extends React.Component {
  renderOptionInput = option => {
    const { config, currentModelActions: { updateConfig } } = this.props
    return (
      <Input
        key={option}
        label={displayOption(option)}
        value={config[option] || ''}
        onChange={(_, data) => updateConfig(option, data.value)}
      />
    )
  }

  renderOptionCheckbox = option => {
    const { config, currentModelActions: { updateConfig } } = this.props
    return (
      <Checkbox
        key={option}
        label={displayOption(option)}
        checked={!!config[option]}
        onChange={(_, data) => updateConfig(option, data.checked)}
      />
    )
  }

  renderMethodCheckbox = method => {
    const { methods, currentModelActions: { updateMethod } } = this.props
    return (
      <Checkbox
        key={method}
        label={displayMethod(method)}
        checked={!!methods[method]}
        onChange={(_, data) => updateMethod(method, data.checked)}
      />
    )
  }

  static INPUT_OPTIONS = [
    OPTIONS.TABLE_NAME,
    OPTIONS.SINGULAR,
    OPTIONS.PLURAL
  ]

  static CHECKBOX_OPTIONS = [
    OPTIONS.FREEZE_TABLE_NAME,
    OPTIONS.UNDERSCORED_COLUMNS,
    OPTIONS.UNDERSCORED_TABLE_NAME
  ]

  static METHODS = [
    METHODS.HOOKS,
    METHODS.GETTER_METHODS,
    METHODS.SETTER_METHODS,
    METHODS.INSTANCE_METHODS,
    METHODS.CLASS_METHODS
  ]

  render () {
    return (
      <React.Fragment>
        <h3>Table Options</h3>
        {Configuration.INPUT_OPTIONS.map(this.renderOptionInput)}
        {Configuration.CHECKBOX_OPTIONS.map(this.renderOptionCheckbox)}
        {console.log(Configuration.METHODS) || Configuration.METHODS.map(this.renderMethodCheckbox)}
      </React.Fragment>
    )
  }
}

export default Configuration
