import React from 'react'

const dataTypeOptions = [
  { text: 'String', value: 'STRING' },
  { text: 'Text', value: 'TEXT' },
  { text: 'Integer', value: 'INTEGER' },
  { text: 'Float', value: 'FLOAT' },
  { text: 'Real', value: 'REAL' },
  { text: 'Double', value: 'DOUBLE' },
  { text: 'Decimal', value: 'DECIMAL' },
  { text: 'Date', value: 'DATE' },
  { text: 'Date (without time)', value: 'DATEONLY' },
  { text: 'Boolean', value: 'BOOLEAN' },
  { text: 'Array', value: 'ARRAY' },
  { text: 'JSON', value: 'JSON' },
  { text: 'BLOB', value: 'BLOB' },
  { text: 'UUID', value: 'UUID' }
]

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      error: null,
      nextModelId: 1,
      nextFieldId: 1,
      models: [],
      currentModel: null,
      newModelName: '',
      newFieldName: ''
    }
  }

  preventDefault = event => event.preventDefault()

  handleNewModelNameChange = event =>
    this.setState({ newModelName: event.target.value })

  handleNewFieldNameChange = event =>
    this.setState({ newFieldName: event.target.value })

  handleNewFieldDataTypeChange = event =>
    this.setState({ newFieldType: event.target.value })

  createModel = () =>
    this.setState({
      models: [...this.state.models, this.newModel(this.state.newModelName)],
      newModelName: '',
      nextModelId: this.state.nextModelId + 1
    })

  newModel = () => ({
    id: this.state.nextModelId,
    name: this.state.newModelName,
    fields: []
  })

  createField = () =>
    this.setState({
      currentModel: {
        ...this.state.currentModel,
        fields: [...this.state.currentModel.fields, this.newField()]
      },
      newFieldName: '',
      newFieldType: null,
      nextFieldId: this.state.nextFieldId + 1
    })

  newField = () => ({
    id: this.state.nextFieldId,
    name: this.state.newFieldName,
    dataType: this.state.newFieldType
  })

  goToModels = () => this.setState({ currentModel: null })

  goToModel = id => {
    const model = this.state.models.find(m => m.id === id)
    if (model) this.setState({ currentModel: model })
    else this.setState({ error: 'Model not found' })
  }

  render () {
    if (this.state.currentModel) {
      return (
        <React.Fragment>
          <p>{JSON.stringify(this.state, 2)}</p>
          <h1>Sequelize UI</h1>
          <button onClick={this.goToModels}>Back</button>
          <h2>{this.state.currentModel.name}</h2>
          <form onSubmit={this.preventDefault}>
            <input
              type='text'
              value={this.state.newFieldName}
              onChange={this.handleNewFieldNameChange}
            />
            <select onChange={this.handleNewFieldDataTypeChange}>
              {dataTypeOptions.map(dataType => (
                <option
                  key={dataType.value}
                  value={dataType.value}
                  selected={this.state.newFieldType === dataType.value}
                >
                  {dataType.text}
                </option>
              ))}
            </select>
            <button onClick={() => this.createField()}>Create Field</button>
          </form>
          <ul>
            {this.state.currentModel.fields.map(field => (
              <li key={field.id}>{field.name}</li>
            ))}
          </ul>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <p>{JSON.stringify(this.state)}</p>
          <h1>Sequelize UI</h1>
          <form onSubmit={this.preventDefault}>
            <input
              type='text'
              value={this.state.newModelName}
              onChange={this.handleNewModelNameChange}
            />
            <button onClick={() => this.createModel()}>Create Model</button>
          </form>
          <ul>
            {this.state.models.map(model => (
              <li key={model.id} onClick={() => this.goToModel(model.id)}>
                {model.name}
              </li>
            ))}
          </ul>
        </React.Fragment>
      )
    }
  }
}
