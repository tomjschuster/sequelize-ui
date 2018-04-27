import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import { actionCreators as uiActions } from '../redux/ui'
import { actionCreators as modelsActions } from '../redux/models'
import {
  thunks as currentModelThunks, actionCreators as currentModelActions
} from '../redux/currentModel'

/* ----------  APP COMPONENTS  ---------- */
import AppBar from './AppBar'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Menu, Icon, Container, Button } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */
class ViewModel extends React.Component {
  componentDidMount () {
    this.props.currentModelThunks.setModel(this.props.match.params.id)
  }

  componentDidUpdate () {
    if (this.props.match.params.id !== this.props.currentModel.id) {
      this.props.currentModelThunks.setModel(this.props.match.params.id)
      this.props.uiActions.closeAllFields()
    }
  }

  componentWillUnmount () {
    this.props.currentModelActions.resetModel()
    this.props.uiActions.closeAllFields()
  }

  goHome = () => {
    this.props.history.push('/')
  }

  editModel = () => {
    this.props.history.push(`/${this.props.currentModel.id}/edit`)
  }

  deleteModel = () => {
    this.props.modelsActions.removeModel(this.props.currentModel.id)
    this.props.history.push('/')
  }

  render () {
    return (
      <React.Fragment>
        <AppBar
          menuLinks={[
            <Menu.Item key='home' onClick={this.goHome}>
              <Icon name='cubes' />
              Models
            </Menu.Item>,
            <Menu.Item key='model' active>
              <Icon name='cube' />
              {this.props.currentModel.name}
            </Menu.Item>
          ]}
        />
        <Container id='content'>
          <h3>{this.props.currentModel.name}</h3>
          <Button icon='edit' onClick={this.editModel} />
          <Button icon='delete' onClick={this.deleteModel} />
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ currentModel, models, ui }) => ({
  fieldsToggle: ui.fieldsToggle,
  currentModel,
  models
})

const mapDispatchToProps = dispatch => ({
  modelsActions: bindActionCreators(modelsActions, dispatch),
  currentModelActions: bindActionCreators(currentModelActions, dispatch),
  currentModelThunks: bindActionCreators(currentModelThunks, dispatch),
  uiActions: bindActionCreators(uiActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ViewModel)
