'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { addField } from '../../redux/currentModel'
import Field from './Field'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'

export class Fields extends Component {
  render() {
    let { currentModel, createField } = this.props
    return (
      <Paper id='fields-paper'>
        <div id='create-field-header'>
          <span id='create-field-title'>Fields</span>
          <RaisedButton
            primary={true}
            label='+ ADD'
            onClick={createField}
          />
        </div>
        <div id='fields-row row'>
          { currentModel.fields.map( (field, idx) => (
              <Field
                key={idx}
                idx={idx}
                field={field}
              />
          ))}
        </div>
      </Paper>
    )
  }
}


const mapStateToProps = ({ currentModel }) => ({ currentModel })
const mapDispatchToProps = dispatch => ({
  createField: field => dispatch(addField(field))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fields)
