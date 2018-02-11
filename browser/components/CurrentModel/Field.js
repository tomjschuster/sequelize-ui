import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  updateField,
  removeField,
  updateValidation
} from '../../redux/currentModel'

import DataTypeDropDown from './DataTypeDropdown'

import { Button } from 'react-toolbox/lib/button'
import Checkbox from 'react-toolbox/lib/checkbox'
import Switch from 'react-toolbox/lib/switch'
import { Card } from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input'

/*----------  HELPER FUNCTIONS  ----------*/
const isNumber = type => {
  switch (type) {
    case 'INTEGER':
    case 'FLOAT':
    case 'REAL':
    case 'DOUBLE':
    case 'DECIMAL':
      return true
    default:
      return false
  }
}

class Field extends Component {
  constructor(props) {
    super(props)
    this.state = { expanded: false }
    this.toggleFieldExpansion = this.toggleFieldExpansion.bind(this)
  }

  toggleFieldExpansion() {
    this.setState({ expanded: !this.state.expanded })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentModel.id !== this.props.currentModel.id) {
      this.setState({ expanded: false })
    }
  }

  render() {
    let { toggleFieldExpansion } = this
    let {
      field,
      idx,
      updateFieldProps,
      deleteField,
      updateFieldValidation
    } = this.props
    let { expanded } = this.state
    return (
      <Card>
        <div>
          <Input
            value={field.name}
            onChange={value => updateFieldProps('name', value, idx)}
            type="text"
            label="Field Name"
          />
          <DataTypeDropDown
            currType={field.type}
            idx={idx}
            onClick={updateFieldProps}
          />
          <Button label="DELETE FIELD" onClick={() => deleteField(idx)} />
          <Switch
            onChange={() => toggleFieldExpansion()}
            checked={expanded}
            label="More Options"
          />
        </div>
        {expanded && (
          <div>
            <Checkbox
              label="UNIQUE"
              checked={Boolean(field.unique)}
              onChange={isChecked => updateFieldProps('unique', isChecked, idx)}
            />
            {field.unique && (
              <Input
                value={field.uniqueKey}
                onChange={value => updateFieldProps('uniqueKey', value, idx)}
                type="text"
                label="Unique Key"
              />
            )}
            <Checkbox
              label="NOT NULL"
              checked={field.allowNull === false}
              onChange={isChecked =>
                updateFieldProps('allowNull', !isChecked, idx)
              }
            />
            <Checkbox
              label="PRIMARY KEY"
              checked={field.primaryKey}
              onChange={isChecked =>
                updateFieldProps('primaryKey', isChecked, idx)
              }
            />
            <Checkbox
              label="AUTOINCREMENT"
              checked={field.autoIncrement}
              onChange={isChecked =>
                updateFieldProps('autoIncrement', isChecked, idx)
              }
            />
            <Input
              value={field.default || ''}
              onChange={value => updateFieldProps('default', value, idx)}
              type="text"
              label="Default Value"
            />
            <Input
              value={field.comment || ''}
              onChange={value => updateFieldProps('comment', value, idx)}
              type="text"
              label="Comment"
            />
            <Input
              value={field.field || ''}
              onChange={value => updateFieldProps('field', value, idx)}
              type="text"
              label="Field Name"
            />
            <h4>Validation</h4>
            <Input
              value={field.validate.is || ''}
              onChange={value => updateFieldValidation('is', value, idx)}
              type="text"
              label="is (/^[a-z]+$/i)"
            />
            <Input
              value={field.validate.contains || ''}
              onChange={value => updateFieldValidation('contains', value, idx)}
              type="text"
              label="contains"
            />
            {field.type === 'STRING' && (
              <Checkbox
                label="isEmail"
                checked={field.validate.isEmail || false}
                onChange={isChecked =>
                  updateFieldValidation('isEmail', isChecked, idx)
                }
              />
            )}
            {field.type === 'STRING' && (
              <Checkbox
                label="isUrl"
                checked={field.validate.isUrl || false}
                onChange={isChecked =>
                  updateFieldValidation('isUrl', isChecked, idx)
                }
              />
            )}
            {isNumber(field.type) && (
              <Input
                value={field.validate.min || ''}
                onChange={value => updateFieldValidation('min', value, idx)}
                type="text"
                label="min"
              />
            )}
            {isNumber(field.type) && (
              <Input
                value={field.validate.max || ''}
                onChange={value => updateFieldValidation('max', value, idx)}
                type="text"
                label="max"
              />
            )}
          </div>
        )}
      </Card>
    )
  }
}

/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ currentModel }) => ({ currentModel })
const mapDispatchToProps = dispatch => ({
  updateFieldProps: (key, val, idx) => dispatch(updateField(key, val, idx)),
  updateFieldValidation: (key, val, idx) =>
    dispatch(updateValidation(key, val, idx)),
  deleteField: idx => dispatch(removeField(idx))
})

export default connect(mapStateToProps, mapDispatchToProps)(Field)
