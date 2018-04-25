import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import { actionCreators as uiActions } from '../redux/ui'
import { actionCreators as modelsActions } from '../redux/models'
import {
  thunks as currentModelThunks, actionCreators as currentModelActions
} from '../redux/currentModel'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button } from 'semantic-ui-react'

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

  editModel = () => {
    this.props.history.push(`/schema/models/${this.props.currentModel.id}/edit`)
  }

  deleteModel = () => {
    console.log(this.props)
    this.props.modelsActions.removeModel()
    this.props.history.push('/schema')
  }

  render () {
    return (
      <React.Fragment>
        <h3>{this.props.currentModel.name}</h3>
        <Button icon='edit' onClick={this.editModel} />
        <Button icon='delete' onClick={this.deleteModel} />
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
