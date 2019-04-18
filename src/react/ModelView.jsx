import React from 'react'

import * as sequelize4 from '../templates/sequelize-4.js'
import Button from './Button.jsx'
import ToolBelt from './ToolBelt.jsx'
import Code from './Code.jsx'

import { DATA_TYPE_OPTIONS } from '../constants.js'

export default class ModelView extends React.Component {
  constructor (props) {
    super(props)
    this.editButtonRef = React.createRef()
    this.state = { codeOpen: false }
  }

  componentDidMount () {
    console.log('mounted')
    if (this.props.fromEdit) {
      this.editButtonRef.current.focus()
      this.props.clearFromEdit()
    }
  }

  toggleCode = () => this.setState({ codeOpen: !this.state.codeOpen })

  renderCode = () =>
    sequelize4.modelFile({ model: this.props.model, config: this.props.config })
      .content

  render () {
    return (
      <main className='main-content model-view'>
        <h2 className='title'>{this.props.model.name} Model</h2>
        <ToolBelt>
          <Button
            icon='left-arrow'
            label='Back'
            onClick={this.props.goToModels}
          />
          <Button
            ref={this.editButtonRef}
            icon='left-pencil'
            label='Edit'
            onClick={this.props.editModel}
          />
          <Button icon='code' label='Code' onClick={this.toggleCode} />
        </ToolBelt>
        {this.state.codeOpen ? (
          <div className='model-code'>
            <Code
              code={this.renderCode()}
              copyButton
              language='javascript'
              onHide={this.toggleCode}
            />
          </div>
        ) : null}
        <h3 className='fields-title subtitle'>Fields</h3>
        {this.props.model.fields.length === 0 ? (
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
              {this.props.model.fields.map(field => (
                <tr key={field.id}>
                  <td className='fields-table__name-cell fields-table__cell'>
                    {field.name}
                  </td>
                  <td className='fields-table__cell'>
                    {DATA_TYPE_OPTIONS[field.type]}
                  </td>
                  <td className='fields-table__cell'>
                    {showFieldOptions(field)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    )
  }
}

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
