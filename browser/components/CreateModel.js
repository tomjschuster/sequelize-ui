import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { times } from 'lodash';
import { addModel } from '../redux/models';

export class CreateModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {
        name: '',
        fields: [{
          name: '',
          type: 'STRING'
        }]
      }
    };
    this.onAddField = this.onAddField.bind(this);
    this.onRemoveField = this.onRemoveField.bind(this);
    this.onModelNameChange = this.onModelNameChange.bind(this);
    this.onFieldNameChange = this.onFieldNameChange.bind(this);
    this.onFieldTypeChange = this.onFieldTypeChange.bind(this);
    this.createModel = this.createModel.bind(this);
  }

  onAddField() {
    let { model } = this.state;
    this.setState({model: {name: model.name, fields: [...model.fields, {name: '', type: 'STRING'}]}});
  }

  onRemoveField(idx) {
    let fields = [...this.state.model.fields];
    fields.splice(idx, 1);
    this.setState({model: {name: this.state.model.name, fields}});
  }

  onModelNameChange(evt) {
    let name = evt.target.value;
    this.setState({model: {name, fields: this.state.model.fields}});
  }

  onFieldNameChange(val, idx) {
    let fields = [...this.state.model.fields];
    fields[idx].name = val;
    this.setState({fields});
  }

  onFieldTypeChange(val, idx) {
    let fields = [...this.state.model.fields];
    fields[idx].type = val;
    this.setState({fields});
  }

  createModel() {
    this.props.addModel(this.state.model);
    this.setState({
      model: {
        name: '',
        fields: [
          {
            name: '',
            type: 'STRING'
          }
        ]
      }
    });
    // axios.post('/api', {models: [this.state.model]});
  }

  render() {
    let { onAddField,
          onRemoveField,
          onModelNameChange,
          onFieldNameChange,
          onFieldTypeChange,
          createModel } = this;
    let { name,
          fields } = this.state.model;
    let { models } = this.props;
    return (
      <div>
        <div>
          <div><input onChange={onModelNameChange} value={name} type="text" placeholder="model name"/></div>
          { times(fields.length, idx => (
            <div key={idx}>
              <input onChange={evt => onFieldNameChange(evt.target.value, idx)} value={fields[idx].name} type="text" placeholder="field name"/>
              <select defaultValue="STRING"
                      onChange={evt => onFieldTypeChange(evt.target.value, idx)}>
                <option value="STRING">String</option>
                <option value="TEXT">Text</option>
                <option value="BOOLEAN">Boolean</option>
                <option value="INTEGER">Integer</option>
                <option value="DECIMAL">Decimal</option>
                <option value="FLOAT">Float</option>
                <option value="ARRAY">Array</option>
                <option value="DATE">Date</option>
              </select>
              <input type="button" value="x" onClick={() => onRemoveField(idx)} />
            </div>
            ))}
          <div><input type="button" onClick={createModel} value="Create Model"/><input type="button" value="add field" onClick={onAddField} /></div>
        </div>
        <div>
          { models.map((model, idx) => (
            <div key={idx}>
              <table>
                <thead>
                  <tr>
                    <th>{model.name}</th>
                  </tr>
                  <tr>
                    <th>Field Name</th>
                    <th>Data Type</th>
                  </tr>
                </thead>
                <tbody>
                    { model.fields.map((field, idx) => (
                      <tr key={idx}>
                        <td>{field.name}</td>
                        <td>{field.type}</td>
                      </tr>
                      )) }
                </tbody>
                <tfoot>
                  <tr>
                    <td><input type="button" value="Delete Model"/></td>
                    <td><input type="button" value="Edit Model"/></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            ))}
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ models }) => ({ models });
const mapDispatchToProps = dispatch => ({ addModel: model => dispatch(addModel(model))});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateModel);
