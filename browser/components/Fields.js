'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addField } from '../redux/currentModel';
import Field from './Field';
import RaisedButton from 'material-ui/RaisedButton';

export class Fields extends Component {
  constructor(props) {
    super(props);
    this.state = { expanded: []};
    this.toggleFieldExpansion = this.toggleFieldExpansion.bind(this);
  }

  toggleFieldExpansion(idx) {
    let expanded = [...this.state.expanded];
    expanded[idx] = !expanded[idx];
    this.setState({expanded});
  }

  render() {
    let { currentModel, addField } = this.props;
    return (
      <div className="create-field-grid">
        <div className="create-field-header">
          <span className="create-field-title">Fields</span>
          <RaisedButton primary={true} label="+ ADD" onClick={addField} />
        </div>
        <div className="row">
          { currentModel.fields.map( (field, idx) => (
            <Field field={field}
                   idx={idx}
                   expanded={this.state.expanded[idx]}
                   handleToggle={this.toggleFieldExpansion}/>
          ))}
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ currentModel }) => ({ currentModel });
const mapDispatchToProps = dispatch => ({
  addField: field => dispatch(addField(field))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fields);
