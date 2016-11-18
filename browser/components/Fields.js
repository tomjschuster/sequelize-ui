'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

/*----------  LOCAL COMPONENTS  ----------*/
import Field from './Field';

/*----------  LIBRARY COMPONENTS  ----------*/
import RaisedButton from 'material-ui/RaisedButton';

export class Fields extends Component {
  render() {
    let { model,
          expandedFields,
          toggleFieldState,
          addField,
          updateField,
          updateValidation,
          deleteField } = this.props;
    return (
      <div className="create-field-grid">
        <div className="create-field-header">
          <span className="create-field-title">Fields</span>
          <RaisedButton primary={true} label="+ ADD" onClick={addField} />
        </div>
        <div className="row">
          { model.fields.map( (field, fieldIdx) => (
            <Field field={field}
                   idx={fieldIdx}
                   expanded={expandedFields[fieldIdx]}
                   updateField={updateField}
                   deleteField={deleteField}
                   toggleFieldState={toggleFieldState}
                   updateValidation={updateValidation}/>
          ))}
        </div>
      </div>
    );
  }
}


/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ models }) => ({ models });
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fields);
