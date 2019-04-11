import React from 'react'

import * as sequelize4 from '../templates/sequelize-4.js'
import Button from './Button.jsx'
import ToolBelt from './ToolBelt.jsx'

import { DATA_TYPE_OPTIONS } from '../constants.js'

const ModelView = ({ model, config, goToModels, editModel }) => (
  <main className='main-content model-view'>
    <h2 className='title'>{model.name} Model</h2>
    <ToolBelt>
      <Button icon='left-arrow' label='Back' onClick={goToModels} />
      <Button icon='left-pencil' label='Edit' onClick={editModel} />
      <Button icon='code' label='Code' />
    </ToolBelt>
    <h3 className='fields-title subtitle'>Fields</h3>
    {model.fields.length === 0 ? (
      <p>No Fields</p>
    ) : (
      <table className='fields-table' key='abc'>
        <thead>
          <tr>
            <th className='fields-table__name-header fields-table__cell'>
              Name
            </th>
            <th className='fields-table__cell'>Type</th>
            <th className='fields-table__cell'>Options</th>
          </tr>
        </thead>
        <tbody>
          {model.fields.map(field => (
            <tr key={field.id}>
              <td className='fields-table__name-cell fields-table__cell'>
                {field.name}
              </td>
              <td className='fields-table__cell'>
                {DATA_TYPE_OPTIONS[field.type]}
              </td>
              <td className='fields-table__cell'>{showFieldOptions(field)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    <pre className='model-code-preview'>
      <code className='language-js'>
        {sequelize4.modelFile({ model, config }).content}
      </code>
    </pre>
  </main>
)

const showFieldOptions = field => {
  const options = {
    primaryKey: 'PK',
    required: 'REQ',
    unique: 'UQ'
  }

  const display = Object.entries(options)
    .filter(([option, _]) => field[option])
    .map(([_, text]) => text)
    .join(', ')

  return display
}

export default ModelView
