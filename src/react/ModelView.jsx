import React from 'react'

import BreadCrumbs from './BreadCrumbs.jsx'

import { DATA_TYPE_OPTIONS } from '../constants.js'

const ModelView = ({ model, goToModels, startEditingModel }) => (
  <React.Fragment>
    <BreadCrumbs
      crumbs={[{ text: 'Models', onClick: goToModels }, { text: model.name }]}
    />
    <button onClick={goToModels}>Back</button>
    <button onClick={startEditingModel}>Edit</button>
    <h2>{model.name}</h2>
    <h3>Fields</h3>
    {model.fields.length === 0 ? (
      <p>No Fields</p>
    ) : (
      <ul key='abc'>
        {model.fields.map(field => (
          <li key={field.id}>
            {field.name} - {DATA_TYPE_OPTIONS[field.type]}{' '}
            {showFieldOptions(field)}
          </li>
        ))}
      </ul>
    )}
  </React.Fragment>
)

const showFieldOptions = field => {
  const options = {
    primaryKey: 'Primary Key',
    required: 'Required',
    unique: 'Unique'
  }

  const display = Object.entries(options)
    .filter(([option, _]) => field[option])
    .map(([_, text]) => text)
    .join(', ')

  return display ? `(${display})` : ''
}

export default ModelView
