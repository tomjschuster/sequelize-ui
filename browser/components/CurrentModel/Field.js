import React, { Component } from 'react'
import { connect } from 'react-redux'

/*----------  ACTION/THUNK CREATORS  ----------*/

import {
  updateField,
  removeField,
  updateValidation
} from '../../redux/currentModel'

/*----------  APP COMPONENTS  ----------*/
import DataTypeDropDown from './DataTypeDropdown'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import { Button } from 'react-toolbox/lib/button'
import Checkbox from 'react-toolbox/lib/checkbox'
import Switch from 'react-toolbox/lib/switch'
import { Card } from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input'

/*----------  HELPERS  ----------*/
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

/*----------  COMPONENT  ----------*/
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
            onChange={value => updateFieldProps('name', value, field.id)}
            type="text"
            label="Field Name"
          />
          <DataTypeDropDown
            currType={field.type}
            id={field.id}
            onClick={updateFieldProps}
          />
          <Button label="DELETE FIELD" onClick={() => deleteField(field.id)} />
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
              onChange={isChecked =>
                updateFieldProps('unique', isChecked, field.id)
              }
            />
            {field.unique && (
              <Input
                value={field.uniqueKey}
                onChange={value =>
                  updateFieldProps('uniqueKey', value, field.id)
                }
                type="text"
                label="Unique Key"
              />
            )}
            <Checkbox
              label="NOT NULL"
              checked={field.allowNull === false}
              onChange={isChecked =>
                updateFieldProps('allowNull', !isChecked, field.id)
              }
            />
            <Checkbox
              label="PRIMARY KEY"
              checked={field.primaryKey}
              onChange={isChecked =>
                updateFieldProps('primaryKey', isChecked, field.id)
              }
            />
            <Checkbox
              label="AUTOINCREMENT"
              checked={field.autoIncrement}
              onChange={isChecked =>
                updateFieldProps('autoIncrement', isChecked, field.id)
              }
            />
            <Input
              value={field.default || ''}
              onChange={value => updateFieldProps('default', value, field.id)}
              type="text"
              label="Default Value"
            />
            <Input
              value={field.comment || ''}
              onChange={value => updateFieldProps('comment', value, field.id)}
              type="text"
              label="Comment"
            />
            <Input
              value={field.field || ''}
              onChange={value => updateFieldProps('field', value, field.id)}
              type="text"
              label="Field Name"
            />
            <h4>Validation</h4>
            <Input
              value={field.validate.is || ''}
              onChange={value => updateFieldValidation('is', value, field.id)}
              type="text"
              label="is (/^[a-z]+$/i)"
            />
            <Input
              value={field.validate.contains || ''}
              onChange={value =>
                updateFieldValidation('contains', value, field.id)
              }
              type="text"
              label="contains"
            />
            {field.type === 'STRING' && (
              <Checkbox
                label="isEmail"
                checked={field.validate.isEmail || false}
                onChange={isChecked =>
                  updateFieldValidation('isEmail', isChecked, field.id)
                }
              />
            )}
            {field.type === 'STRING' && (
              <Checkbox
                label="isUrl"
                checked={field.validate.isUrl || false}
                onChange={isChecked =>
                  updateFieldValidation('isUrl', isChecked, field.id)
                }
              />
            )}
            {isNumber(field.type) && (
              <Input
                value={field.validate.min || ''}
                onChange={value =>
                  updateFieldValidation('min', value, field.id)
                }
                type="text"
                label="min"
              />
            )}
            {isNumber(field.type) && (
              <Input
                value={field.validate.max || ''}
                onChange={value =>
                  updateFieldValidation('max', value, field.id)
                }
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

/*----------  CONNECT  ----------*/
const mapStateToProps = ({ currentModel }) => ({ currentModel })

const mapDispatchToProps = dispatch => ({
  updateFieldProps: (key, val, id) => dispatch(updateField(key, val, id)),
  updateFieldValidation: (key, val, id) =>
    dispatch(updateValidation(key, val, id)),
  deleteField: id => dispatch(removeField(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Field)
