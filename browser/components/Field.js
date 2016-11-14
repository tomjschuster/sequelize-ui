import React, { Component } from 'react';

/*----------  LOCAL COMPONENTS  ----------*/
import DataTypeDropDown from './DataTypeDropDown';

/*----------  LIBRARY COMPONENTS  ----------*/
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';

/*----------  COLORS  ----------*/
import {grey400, darkBlack, lightBlack, red400, white, blueGrey200} from 'material-ui/styles/colors';

/*----------  HELPER FUNCTIONS  ----------*/
const isNumber = (type) => {
  switch (type) {
    case 'INTEGER':
    case 'FLOAT':
    case 'REAL':
    case 'DOUBLE':
    case 'DECIMAL': return true;
    default: return false;
  }
};

/*----------  COMPONENT  ----------*/
export default class Field extends Component {
  render() {
    let { field,
          idx,
          expandedFields,
          updateField,
          deleteField,
          toggleFieldState,
          updateValidation } = this.props;
    return (
      <div className="col m12 l6" key={idx}>
        <Card expanded={expandedFields[idx]}
              style={{
                marginBottom: '5%'
              }}>
              <CardActions>
                <TextField value={field.name}
                           onChange={evt => updateField('name', evt.target.value, idx)}
                           type="text" hintText="Field Name"/>
                <DataTypeDropDown currType={field.type}
                                  idx={idx}
                                  onClick={updateField}/>
                <FlatButton label="DELETE FIELD"
                            labelStyle={{color: red400}}
                            onClick={() => deleteField(idx)}/>
                <Toggle onToggle={() => toggleFieldState(idx)}
                        label="More Options"
                        labelPosition="right"/>
              </CardActions>
              <CardActions expandable={true}>
                <div className="row">
                  <div className="col 4">
                    <ul>
                      <li>
                      <Checkbox label="UNIQUE"
                                checked={Boolean(field.unique)}
                                onCheck={(evt, isChecked) =>
                                  updateField('unique', isChecked, idx)}/>
                      </li>
                      {field.unique && (
                        <li>
                          <TextField value={field.uniqueKey}
                                     style={{
                                       fontSize: '0.8em',
                                       width: '100%',
                                       marginTop: -10,
                                       marginBottom: -10
                                     }}
                                     onChange={evt =>
                                       updateField('uniqueKey', evt.target.value, idx)}
                                     type="text"
                                     hintText="Unique Key"/>
                      </li>
                      )}
                      <li>
                        <Checkbox label="NOT NULL"
                                  checked={field.allowNull === false}
                                  onCheck={(evt, isChecked) =>
                                    updateField('allowNull', !isChecked, idx)}/>
                      </li>
                      <li>
                        <Checkbox label="PRIMARY KEY"
                                  checked={field.primaryKey}
                                  onCheck={(evt, isChecked) =>
                                    updateField('primaryKey', isChecked, idx)}/>
                      </li>
                      <li>
                        <Checkbox label="AUTOINCREMENT"
                                  checked={field.autoIncrement}
                                  onCheck={(evt, isChecked) =>
                                    updateField('autoIncrement', isChecked, idx)}/>
                      </li>
                    </ul>
                  </div>
                  <div className="col 4">
                    <ul>
                      <li>
                        <TextField value={field.default}
                                   style={{
                                     fontSize: '0.8em',
                                     width: '100%',
                                     marginTop: -10,
                                     marginBottom: -10
                                   }}
                                   onChange={evt =>
                                     updateField('default', evt.target.value, idx)}
                                   type="text" hintText="Default Value"/>
                      </li>
                      <li>
                        <TextField value={field.comment}
                                   style={{
                                     fontSize: '0.8em',
                                     width: '100%',
                                     marginTop: -10,
                                     marginBottom: -10
                                   }}
                                   onChange={evt =>
                                     updateField('comment', evt.target.value, idx)}
                                   type="text" hintText="Comment"/>
                      </li>
                      <li>
                        <TextField value={field.field}
                                   style={{
                                     fontSize: '0.8em',
                                     width: '100%',
                                     marginTop: -10,
                                     marginBottom: -10
                                   }}
                                   onChange={evt =>
                                     updateField('field', evt.target.value, idx)}
                                   type="text" hintText="Field Name"/>
                      </li>
                    </ul>
                  </div>
                  <div className="col 4">
                    <ul>
                      <li>Validation</li>
                      <li>
                          <TextField value={field.validate && field.validate.is}
                                     style={{
                                       fontSize: '0.8em',
                                       width: '100%',
                                       marginTop: -10,
                                       marginBottom: -10
                                     }}
                                     onChange={evt =>
                                       updateValidation('is', evt.target.value, idx)}
                                     type="text"
                                     hintText="is (/^[a-z]+$/i)"/>
                      </li>
                      <li>
                          <TextField value={field.validate && field.validate.contains}
                                     style={{
                                       fontSize: '0.8em',
                                       width: '100%',
                                       marginTop: -10,
                                       marginBottom: -10
                                     }}
                                     onChange={evt =>
                                       updateValidation('contains', evt.target.value, idx)}
                                     type="text"
                                     hintText="contains"/>
                      </li>
                      { field.type === 'STRING' &&
                        <li>
                          <Checkbox label="isEmail"
                                    checked={field.validate && field.validate.isEmail}
                                    onCheck={(evt, isChecked) =>
                                      updateValidation('isEmail', isChecked, idx)}/>
                          <Checkbox label="isUrl"
                                    checked={field.validate && field.validate.isUrl}
                                    onCheck={(evt, isChecked) =>
                                      updateValidation('isUrl', isChecked, idx)}/>
                        </li>
                      }
                      { isNumber(field.type) && (
                        <li>
                          <TextField value={field.validate && field.validate.min}
                                     style={{
                                       fontSize: '0.8em',
                                       width: '33%',
                                       marginTop: -10,
                                       marginBottom: -10
                                     }}
                                     onChange={evt =>
                                       updateValidation('min', evt.target.value, idx)}
                                     type="text"
                                     hintText="min"/>
                          <TextField value={field.validate && field.validate.max}
                                     style={{
                                       fontSize: '0.8em',
                                       width: '33%',
                                       marginTop: -10,
                                       marginBottom: -10
                                     }}
                                     onChange={evt =>
                                       updateValidation('max', evt.target.value, idx)}
                                     type="text"
                                     hintText="max"/>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardActions>
        </Card>
      </div>
    );
  }
}
