'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addField } from '../../redux/currentModel';
import Field from './Field';
import RaisedButton from 'material-ui/RaisedButton';

export class Fields extends Component {
  render() {
    let { currentModel, createField } = this.props;
    return (
      <div className="create-field-grid">
        <div className="create-field-header">
          <span className="create-field-title">Fields</span>
          <RaisedButton primary={true} label="+ ADD" onClick={createField} />
        </div>
        <div className="row">
          { currentModel.fields.map( (field, idx) => (
            <Field key={idx}
                   idx={idx}
                   field={field}/>
          ))}
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ currentModel }) => ({ currentModel });
const mapDispatchToProps = dispatch => ({
  createField: field => dispatch(addField(field))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fields);
