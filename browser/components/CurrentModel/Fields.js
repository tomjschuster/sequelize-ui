import React from 'react'
import { connect } from 'react-redux'

import { addField } from '../../redux/currentModel'
import Field from './Field'
import { Button } from 'react-toolbox/lib/button'

const Fields = ({ currentModel, createField }) => (
  <section>
    <h3>Fields</h3>
    <Button label="+ ADD" onClick={createField} raised primary />
    <div>
      {currentModel.fields.map(field => <Field key={field.id} field={field} />)}
    </div>
  </section>
)

const mapStateToProps = ({ currentModel }) => ({ currentModel })
const mapDispatchToProps = dispatch => ({
  createField: field => dispatch(addField(field))
})

export default connect(mapStateToProps, mapDispatchToProps)(Fields)
