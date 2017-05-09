'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateField, removeField, updateValidation } from '../../redux/currentModel'

import DataTypeDropDown from './DataTypeDropdown'

import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import Checkbox from 'material-ui/Checkbox'
import { Card, CardActions } from 'material-ui/Card'
import Toggle from 'material-ui/Toggle'
import { red400 } from 'material-ui/styles/colors'

/*----------  HELPER FUNCTIONS  ----------*/
const isNumber = (type) => {
  switch (type) {
    case 'INTEGER':
    case 'FLOAT':
    case 'REAL':
    case 'DOUBLE':
    case 'DECIMAL': return true
    default: return false
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
      this.setState({ expanded: false})
    }
  }

  render() {
    let { toggleFieldExpansion } = this
    let { field,
          idx,
          updateFieldProps,
          deleteField,
          updateFieldValidation } = this.props
    let { expanded } = this.state
    return (
      <div className='col m12 l6' key={idx}>
        <Card expanded={expanded}
              style={{
                marginBottom: '5%'
              }}>
              <CardActions>
                <TextField
                  value={field.name}
                  onChange={evt => updateFieldProps('name', evt.target.value, idx)}
                  type='text' hintText='Field Name'
                />
                <DataTypeDropDown
                  currType={field.type}
                  idx={idx}
                  onClick={updateFieldProps}
                />
                <FlatButton
                  label='DELETE FIELD'
                  labelStyle={{ color: red400 }}
                  onClick={() => deleteField(idx)}
                />
                <Toggle
                  onToggle={() => toggleFieldExpansion()}
                  toggled={expanded}
                  label='More Options'
                  labelPosition='right'
                />
              </CardActions>
              <CardActions expandable={true}>
                <div className='row'>
                  <div className='col 4'>
                    <ul>
                      <li>
                      <Checkbox
                        label='UNIQUE'
                        checked={Boolean(field.unique)}
                        onCheck={(evt, isChecked) => updateFieldProps('unique', isChecked, idx)}
                      />
                      </li>
                      {field.unique && (
                        <li>
                          <TextField
                            value={field.uniqueKey}
                            style={{
                              fontSize: '0.8em',
                              width: '100%',
                              marginTop: -10,
                              marginBottom: -10
                            }}
                            onChange={evt =>
                              updateFieldProps('uniqueKey', evt.target.value, idx)}
                            type='text'
                            hintText='Unique Key'
                          />
                      </li>
                      )}
                      <li>
                        <Checkbox
                          label='NOT NULL'
                          checked={field.allowNull === false}
                          onCheck={(evt, isChecked) =>
                            updateFieldProps('allowNull', !isChecked, idx)
                          }
                        />
                      </li>
                      <li>
                        <Checkbox
                          label='PRIMARY KEY'
                           checked={field.primaryKey}
                           onCheck={(evt, isChecked) =>
                             updateFieldProps('primaryKey', isChecked, idx)
                           }
                        />
                      </li>
                      <li>
                        <Checkbox
                          label='AUTOINCREMENT'
                          checked={field.autoIncrement}
                          onCheck={(evt, isChecked) =>
                            updateFieldProps('autoIncrement', isChecked, idx)
                          }
                          />
                      </li>
                    </ul>
                  </div>
                  <div className='col 4'>
                    <ul>
                      <li>
                        <TextField
                          value={field.default || ''}
                          style={{
                            fontSize: '0.8em',
                            width: '100%',
                            marginTop: -10,
                            marginBottom: -10
                          }}
                          onChange={evt =>
                            updateFieldProps('default', evt.target.value, idx)
                          }
                          type='text' hintText='Default Value'
                        />
                      </li>
                      <li>
                        <TextField
                          value={field.comment || ''}
                          style={{
                            fontSize: '0.8em',
                            width: '100%',
                            marginTop: -10,
                            marginBottom: -10
                          }}
                          onChange={evt =>
                            updateFieldProps('comment', evt.target.value, idx)
                          }
                          type='text' hintText='Comment'
                        />
                      </li>
                      <li>
                        <TextField
                          value={field.field || ''}
                          style={{
                            fontSize: '0.8em',
                            width: '100%',
                            marginTop: -10,
                            marginBottom: -10
                          }}
                          onChange={evt =>
                            updateFieldProps('field', evt.target.value, idx)
                          }
                          type='text' hintText='Field Name' />
                      </li>
                    </ul>
                  </div>
                  <div className='col 4'>
                    <ul>
                      <li>Validation</li>
                      <li>
                          <TextField
                            value={field.validate.is || ''}
                            style={{
                              fontSize: '0.8em',
                              width: '100%',
                              marginTop: -10,
                              marginBottom: -10
                            }}
                            onChange={evt =>
                              updateFieldValidation('is', evt.target.value, idx)
                            }
                            type='text'
                            hintText='is (/^[a-z]+$/i)'
                          />
                      </li>
                      <li>
                          <TextField
                            value={field.validate.contains  || ''}
                            style={{
                              fontSize: '0.8em',
                              width: '100%',
                              marginTop: -10,
                             marginBottom: -10
                            }}
                            onChange={evt =>
                              updateFieldValidation('contains', evt.target.value, idx)}
                            type='text'
                            hintText='contains'
                          />
                      </li>
                      { field.type === 'STRING' &&
                        <li>
                          <Checkbox
                            label='isEmail'
                            checked={field.validate.isEmail || false}
                            onCheck={(evt, isChecked) =>
                              updateFieldValidation('isEmail', isChecked, idx)
                            }
                          />
                          <Checkbox
                            label='isUrl'
                            checked={field.validate.isUrl || false}
                            onCheck={(evt, isChecked) =>
                              updateFieldValidation('isUrl', isChecked, idx)
                            }
                          />
                        </li>
                      }
                      { isNumber(field.type) && (
                        <li>
                          <TextField
                            value={field.validate.min || ''}
                            style={{
                              fontSize: '0.8em',
                              width: '33%',
                              marginTop: -10,
                              marginBottom: -10
                            }}
                            onChange={evt =>
                              updateFieldValidation('min', evt.target.value, idx)}
                            type='text'
                            hintText='min'
                          />
                          <TextField
                            value={field.validate.max || ''}
                            style={{
                              fontSize: '0.8em',
                              width: '33%',
                              marginTop: -10,
                              marginBottom: -10
                            }}
                            onChange={evt =>
                              updateFieldValidation('max', evt.target.value, idx)
                            }
                            type='text'
                            hintText='max'
                          />
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardActions>
        </Card>
      </div>
    )
  }
}


/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ currentModel }) => ({ currentModel })
const mapDispatchToProps = dispatch => ({
  updateFieldProps: (key, val, idx) => dispatch(updateField(key, val, idx)),
  updateFieldValidation: (key, val, idx) => dispatch(updateValidation(key, val, idx)),
  deleteField: idx => dispatch(removeField(idx))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field)
