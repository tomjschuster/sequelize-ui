import React from 'react'
import { connect } from 'react-redux'

/*----------  ACTION/THUNK CREATORS  ----------*/
import { updateConfig, updateMethod } from '../../redux/currentModel'

/*----------  LIBRARY COMPONENTS  ----------*/
import Checkbox from 'react-toolbox/lib/checkbox'
import Input from 'react-toolbox/lib/input'

/*----------  COMPONENT  ----------*/
const Configuration = ({ currentModel, updateConfig, updateMethod }) => (
  <div>
    <h3>Table Options</h3>
    <Input
      label="Table Name"
      value={currentModel.config.tableName}
      onChange={value => updateConfig('tableName', value)}
    />
    <Input
      label="Singular Name"
      value={currentModel.config.singular}
      onChange={value => updateConfig('singular', value)}
    />
    <Input
      label="Plural Name"
      value={currentModel.config.plural}
      onChange={value => updateConfig('plural', value)}
    />
    <Checkbox
      label="No Timestamp Columns"
      checked={!currentModel.config.timestamps}
      onChange={isChecked => updateConfig('timestamps', !isChecked)}
    />
    <Checkbox
      label="Freeze Table Name"
      checked={currentModel.config.freezeTableName}
      onChange={isChecked => updateConfig('freezeTableName', isChecked)}
    />
    <Checkbox
      label="Underscore Column Names"
      checked={currentModel.config.underscored}
      onChange={isChecked => updateConfig('underscored', isChecked)}
    />
    <Checkbox
      label="Underscore Table Names"
      checked={currentModel.config.underscoredAll}
      onChange={isChecked => updateConfig('underscoredAll', isChecked)}
    />
    <h3>Include Templates For:</h3>
    <Checkbox
      label="Hooks"
      checked={currentModel.methods.hooks}
      onChange={isChecked => updateMethod('hooks', isChecked)}
    />
    <Checkbox
      label="Getter Methods"
      checked={currentModel.methods.getterMethods}
      onChange={isChecked => updateMethod('getterMethods', isChecked)}
    />
    <Checkbox
      label="Setter Methods"
      checked={currentModel.methods.setterMethods}
      onChange={isChecked => updateMethod('setterMethods', isChecked)}
    />
    <Checkbox
      label="Instance Methods"
      checked={currentModel.methods.instanceMethods}
      onChange={isChecked => updateMethod('instanceMethods', isChecked)}
    />
    <Checkbox
      label="Class Methods"
      checked={currentModel.methods.classMethods}
      onChange={isChecked => updateMethod('classMethods', isChecked)}
    />
  </div>
)

/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ currentModel }) => ({ currentModel })
const mapDispatchToProps = dispatch => ({
  updateConfig: (key, val) => dispatch(updateConfig(key, val)),
  updateMethod: (key, val) => dispatch(updateMethod(key, val))
})

export default connect(mapStateToProps, mapDispatchToProps)(Configuration)
