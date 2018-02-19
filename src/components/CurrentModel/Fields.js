import React from 'react'

/* ----------  APP COMPONENTS  ---------- */
import Field from './Field'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button } from 'react-toolbox/lib/button'

/* ----------  COMPONENT  ---------- */

const Fields = ({
  // State
  fields,
  fieldsToggle,
  // Actions
  currentModelActions: { addField, updateField, updateValidation, removeField },
  uiActions: { toggleField }
}) => (
  <section>
    <h3>Fields</h3>
    <Button label='+ ADD' onClick={addField} raised primary />
    <div>
      {fields.map(field => (
        <Field
          key={field.id}
          field={field}
          isOpen={!!fieldsToggle[field.id]}
          updateField={updateField.bind(null, field.id)}
          updateValidation={updateValidation.bind(null, field.id)}
          removeField={removeField.bind(null, field.id)}
          toggleField={toggleField.bind(null, field.id)}
        />
      ))}
    </div>
  </section>
)

export default Fields
