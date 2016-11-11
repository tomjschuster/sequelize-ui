import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { times } from 'lodash';

export class CreateModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {
        name: '',
        fields: [{
          name: '',
          type: ''
        }]
      }
    };
    this.onAddField = this.onAddField.bind(this);
    this.onRemoveField = this.onRemoveField.bind(this);
    this.onModelNameChange = this.onModelNameChange.bind(this);
    this.onFieldNameChange = this.onFieldNameChange.bind(this);
    this.onFieldTypeChange = this.onFieldTypeChange.bind(this);
    this.generateModel = this.generateModel.bind(this);
  }

  onAddField() {
    let { model } = this.state;
    this.setState({model: {name: model.name, fields: [...model.fields, {name: '', type: ''}]}});
  }

  onRemoveField(idx) {
    let fields = [...this.state.model.fields];
    console.log(fields);
    fields.splice(idx, 1);
    console.log(fields);
    this.setState({model: {name: this.state.model.name, fields}});
  }

  onModelNameChange(evt) {
    let name = evt.target.value;
    this.setState({model: {name, fields: this.state.model.fields}});
  }

  onFieldNameChange(val, idx) {
    let fields = [...this.state.model.fields];
    fields[idx].name = val;
    this.setState({fields})
  }

  onFieldTypeChange(val, idx) {
    let fields = [...this.state.model.fields];
    fields[idx].type = val;
    this.setState({fields})
  }

  generateModel() {
    axios.post('/api', {models: [this.state.model]});
  }

  render() {
    let { onAddField, onRemoveField, onModelNameChange, onFieldNameChange, onFieldTypeChange, generateModel } = this;
    let { name, fields } = this.state.model;
    return (
      <div>
        <div><input onChange={onModelNameChange} value={name} type="text" placeholder="model name"/></div>
        { times(fields.length, idx => (
          <div key={idx}>
            <input onChange={evt => onFieldNameChange(evt.target.value, idx)} value={fields[idx].name} type="text" placeholder="field name"/>
            <input onChange={evt => onFieldTypeChange(evt.target.value, idx)} value={fields[idx].type} type="text" placeholder="field type"/>
            { fields.length > 1 && <input type="button" value="remove field" onClick={() => onRemoveField(idx)} /> }
            { idx + 1 === fields.length && <input type="button" value="add field" onClick={onAddField} /> }
          </div>
          ))}
        <div><input type="button" onClick={generateModel} value="Create Model"/></div>
      </div>
    );
  }
}


const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateModel);
