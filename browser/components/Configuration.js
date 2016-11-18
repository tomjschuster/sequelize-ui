'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

/*----------  LIBRARY COMPONENTS  ----------*/
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';


/*----------  COMPONENT  ----------*/
export class Configuration extends Component {
  render() {
    let { model,
          updateConfig,
          updateMethod } = this.props;
    return (
      <Paper>
        <div className="container">
        <Subheader>Table Options</Subheader>
          <div className="row">
            <div className="col s12 m6">
              <TextField hintText="Table Name"
                         value={model.config.tableName}
                         style={{
                                 fontSize: '0.8em',
                                 width: '50%',
                                 marginTop: -5,
                                 marginBottom: -5,
                                 display: 'block',
                                 clear: 'right'
                               }}
                         onChange={evt =>
                             updateConfig('tableName', evt.target.value)}/>
              <TextField hintText="Singular Name"
                         value={model.config.singular}
                         style={{
                                 fontSize: '0.8em',
                                 width: '50%',
                                 marginTop: -5,
                                 marginBottom: -5,
                                 display: 'block',
                                 clear: 'right'
                               }}
                         onChange={evt =>
                             updateConfig('singular', evt.target.value)}/>
              <TextField hintText="Plural Name"
                         value={model.config.plural}
                         style={{
                                 fontSize: '0.8em',
                                 width: '50%',
                                 marginTop: -5,
                                 marginBottom: -5,
                                 display: 'block',
                                 clear: 'right'
                               }}
                         onChange={evt =>
                             updateConfig('plural', evt.target.value)}/>
            </div>
            <div className="col s12 m6">
              <Checkbox label="No Timestamp Columns"
                        checked={!model.config.timestamps}
                        onCheck={(evt, isChecked) =>
                          updateConfig('timestamps', !isChecked)}/>
              <Checkbox label="Freeze Table Name"
                        checked={model.config.freezeTableName}
                        onCheck={(evt, isChecked) =>
                          updateConfig('freezeTableName', isChecked)}/>
              <Checkbox label="Underscore Column Names"
                        checked={model.config.underscored}
                        onCheck={(evt, isChecked) =>
                          updateConfig('underscored', isChecked)}/>
              <Checkbox label="Underscore Table Names"
                        checked={model.config.underscoredAll}
                        onCheck={(evt, isChecked) =>
                          updateConfig('underscoredAll', isChecked)}/>
            </div>
        </div>
        <Divider inset={true} />
        <Subheader>Include Templates For:</Subheader>
        <Checkbox label="Hooks"
                  checked={model.methods.hooks}
                  onCheck={(evt, isChecked) =>
                    updateMethod('hooks', isChecked)}/>
        <Checkbox label="Getter Methods"
                  checked={model.methods.getterMethods}
                  onCheck={(evt, isChecked) =>
                    updateMethod('getterMethods', isChecked)}/>
        <Checkbox label="Setter Methods"
                  checked={model.methods.setterMethods}
                  onCheck={(evt, isChecked) =>
                    updateMethod('setterMethods', isChecked)}/>
        <Checkbox label="Instance Methods"
                  checked={model.methods.instanceMethods}
                  onCheck={(evt, isChecked) =>
                    updateMethod('instanceMethods', isChecked)}/>
        <Checkbox label="Class Methods"
                  checked={model.methods.classMethods}
                  onCheck={(evt, isChecked) =>
                    updateMethod('classMethods', isChecked)}/>
        </div>
      </Paper>
    );
  }
}


/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({}) => ({ });
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Configuration);
