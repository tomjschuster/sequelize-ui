import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import {
  thunks as modelsThunks,
  actionCreators as modelsActions
} from '../../redux/models'
import {
  actionCreators as currentModelActions,
  thunks as currentModelThunks
} from '../../redux/currentModel'
import { actionCreators as uiActions } from '../../redux/ui'

/* ----------  APP COMPONENTS  ---------- */
import AppBar from '../AppBar'
import Fields from './Fields'
import Configuration from './Configuration'
import Associations from './Associations'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Input, Divider, Button, Container, Tab } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */

class Model extends React.Component {
  componentDidMount () {
    this.props.currentModelThunks.setModel(this.props.match.params.id)
  }

  componentDidUpdate () {
    if (this.props.match.params.id !== this.props.currentModel.id) {
      this.props.currentModelThunks.setModel(this.props.match.params.id)
      this.props.uiActions.closeAllFields()
    }
  }

  createModel = () => {
    const { uiActions, modelsThunks, currentModel, models, router } = this.props
    modelsThunks
      .saveModel(currentModel, models, true)
      .then(() => router.push('/'))
      .catch(error => uiActions.openDialog('Validation Error', error))
  }

  saveModel = () => {
    const { uiActions, modelsThunks, currentModel, models, router } = this.props
    modelsThunks
      .saveModel(currentModel, models, false)
      .then(() => router.push('/'))
      .catch(error => uiActions.openDialog('Validation Error', error))
  }

  componentWillUnmount () {
    this.props.currentModelActions.resetModel()
    this.props.uiActions.closeAllFields()
  }

  goHome = () => {
    this.props.history.push('/')
  }

  render () {
    const {
      // State
      tabIdx,
      models,
      currentModel,
      fieldsToggle,
      // Actions
      uiActions,
      currentModelActions,
      modelsActions: { removeModel }
    } = this.props

    return (
      <React.Fragment>
        <AppBar
          menuLinks={[
            { icon: 'cubes', label: 'Models', onClick: this.goHome },
            { icon: 'cube', label: this.props.currentModel.name, active: true }
          ]}
        />
        <Container id='content'>
          <Container textAlign='center'>
            <Input
              placeholder='Name your model...'
              value={currentModel.name}
              onChange={evt => currentModelActions.setModelName(evt.target.value)}
              action
            >
              <input />
              <Button primary onClick={this.saveModel}>Save</Button>
              <Button onClick={() => removeModel(currentModel.id)}>Delete</Button>
            </Input>
          </Container>
          <Divider />
          <Tab
            index={tabIdx}
            onChange={uiActions.setCurrentModelTabIdx}
            panes={[
              {
                menuItem: 'Fields',
                render: () =>
                  <Tab.Pane>
                    <Fields
                      fields={currentModel.fields}
                      fieldsToggle={fieldsToggle}
                      currentModelActions={currentModelActions}
                      uiActions={uiActions}
                    />
                  </Tab.Pane>
              },
              {
                menuItem: 'Configuration',
                render: () =>
                  <Tab.Pane>
                    <Configuration
                      config={currentModel.config}
                      methods={currentModel.methods}
                      currentModelActions={currentModelActions}
                    />
                  </Tab.Pane>
              },
              {
                menuItem: 'Associations',
                render: () =>
                  <Tab.Pane>
                    <Associations
                      models={models}
                      associations={currentModel.associations}
                      currentModelActions={currentModelActions}
                    />
                  </Tab.Pane>
              }
            ]}
          />
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ currentModel, models, ui }) => ({
  tabIdx: ui.currentModelTabIdx,
  fieldsToggle: ui.fieldsToggle,
  currentModel,
  models
})

const mapDispatchToProps = dispatch => ({
  uiActions: bindActionCreators(uiActions, dispatch),
  currentModelActions: bindActionCreators(currentModelActions, dispatch),
  modelsActions: bindActionCreators(modelsActions, dispatch),
  modelsThunks: bindActionCreators(modelsThunks, dispatch),
  currentModelThunks: bindActionCreators(currentModelThunks, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Model)
