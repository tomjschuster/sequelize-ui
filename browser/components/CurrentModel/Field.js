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
import { Card, CardActions } from 'react-toolbox/lib/card'
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
      <div className="col m12 l6" key={idx}>
        <Card>
          <CardActions>
            <Input
              value={field.name}
              onChange={value => updateFieldProps('name', value, idx)}
              type="text"
              hint="Field Name"
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
          </CardActions>
          {expanded && (
            <CardActions>
              <div className="row">
                <div className="col 4">
                  <ul>
                    <li>
                      <Checkbox
                        label="UNIQUE"
                        checked={Boolean(field.unique)}
                        onChange={isChecked =>
                          updateFieldProps('unique', isChecked, idx)
                        }
                      />
                    </li>
                    {field.unique && (
                      <li>
                        <Input
                          value={field.uniqueKey}
                          onChange={value =>
                            updateFieldProps('uniqueKey', value, idx)
                          }
                          type="text"
                          hint="Unique Key"
                        />
                      </li>
                    )}
                    <li>
                      <Checkbox
                        label="NOT NULL"
                        checked={field.allowNull === false}
                        onChange={isChecked =>
                          updateFieldProps('allowNull', !isChecked, idx)
                        }
                      />
                    </li>
                    <li>
                      <Checkbox
                        label="PRIMARY KEY"
                        checked={field.primaryKey}
                        onChange={isChecked =>
                          updateFieldProps('primaryKey', isChecked, idx)
                        }
                      />
                    </li>
                    <li>
                      <Checkbox
                        label="AUTOINCREMENT"
                        checked={field.autoIncrement}
                        onChange={isChecked =>
                          updateFieldProps('autoIncrement', isChecked, idx)
                        }
                      />
                    </li>
                  </ul>
                </div>
                <div className="col 4">
                  <ul>
                    <li>
                      <Input
                        value={field.default || ''}
                        onChange={value =>
                          updateFieldProps('default', value, idx)
                        }
                        type="text"
                        hint="Default Value"
                      />
                    </li>
                    <li>
                      <Input
                        value={field.comment || ''}
                        onChange={value =>
                          updateFieldProps('comment', value, idx)
                        }
                        type="text"
                        hint="Comment"
                      />
                    </li>
                    <li>
                      <Input
                        value={field.field || ''}
                        onChange={value =>
                          updateFieldProps('field', value, idx)
                        }
                        type="text"
                        hint="Field Name"
                      />
                    </li>
                  </ul>
                </div>
                <div className="col 4">
                  <ul>
                    <li>Validation</li>
                    <li>
                      <Input
                        value={field.validate.is || ''}
                        onChange={value =>
                          updateFieldValidation('is', value, idx)
                        }
                        type="text"
                        hint="is (/^[a-z]+$/i)"
                      />
                    </li>
                    <li>
                      <Input
                        value={field.validate.contains || ''}
                        onChange={value =>
                          updateFieldValidation('contains', value, idx)
                        }
                        type="text"
                        hint="contains"
                      />
                    </li>
                    {field.type === 'STRING' && (
                      <li>
                        <Checkbox
                          label="isEmail"
                          checked={field.validate.isEmail || false}
                          onChange={isChecked =>
                            updateFieldValidation('isEmail', isChecked, idx)
                          }
                        />
                        <Checkbox
                          label="isUrl"
                          checked={field.validate.isUrl || false}
                          onChange={isChecked =>
                            updateFieldValidation('isUrl', isChecked, idx)
                          }
                        />
                      </li>
                    )}
                    {isNumber(field.type) && (
                      <li>
                        <Input
                          value={field.validate.min || ''}
                          onChange={value =>
                            updateFieldValidation('min', value, idx)
                          }
                          type="text"
                          hint="min"
                        />
                        <Input
                          value={field.validate.max || ''}
                          onChange={value =>
                            updateFieldValidation('max', value, idx)
                          }
                          type="text"
                          hint="max"
                        />
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardActions>
          )}
        </Card>
      </div>
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
