import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

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
import { Input, Divider, Button, Container, Tab, Grid, Segment } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */

class Model extends React.Component {
  componentDidMount () {
    this.props.currentModelThunks.setModel(this.props.match.params.id)
  }

  componentDidUpdate () {
    if (this.props.match.params.id !== this.props.currentModel.id) {
      this.props.currentModelThunks.setModel(this.props.match.params.id)
    }
  }

  saveModel = () => {
    const { uiActions, modelsThunks, currentModel, models, history } = this.props
    modelsThunks
      .saveModel(currentModel, models, false)
      .then(() => history.push('/'))
      .catch(console.error)
      .catch(error => uiActions.openDialog('Validation Error', error))
  }

  componentWillUnmount () {
    this.props.currentModelActions.resetModel()
  }

  goHome = () => {
    this.props.history.push('/')
  }

  render () {
    const {
      // State
      models,
      currentModel,
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
          <Grid columns={2} divided stackable>
            <Grid.Row streched>
              <Grid.Column>
                <Segment>
                  <Fields
                    fields={currentModel.fields}
                    currentModelActions={currentModelActions}
                    uiActions={uiActions}
                  />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <Configuration
                    config={currentModel.config}
                    methods={currentModel.methods}
                    currentModelActions={currentModelActions}
                  />
                </Segment>
                <Segment>
                  <Associations
                    models={models}
                    associations={currentModel.associations}
                    currentModelActions={currentModelActions}
                  />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ currentModel, models: { models }, ui }) => ({
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

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Model)
