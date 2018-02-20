import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import {
  thunks as modelsThunks,
  actionCreators as modelsActions
} from '../../redux/models'
import { actionCreators as currentModelActions } from '../../redux/currentModel'

/* ----------  APP COMPONENTS  ---------- */
import Models from './Models'

class ModelsPage extends Component {
  gotoModel = id => this.props.router.push(`/models/${id}`)

  render () {
    return (
      <Models
        currentId={this.props.currentId}
        models={this.props.models}
        gotoModel={this.gotoModel}
        modelsActions={this.props.modelsActions}
        modelsThunks={this.props.modelsThunks}
      />
    )
  }
}
const mapStateToProps = ({ currentModel, models }) => ({
  currentId: currentModel.id,
  models
})

const mapDispatchToProps = dispatch => ({
  currentModelActions: bindActionCreators(currentModelActions, dispatch),
  modelsActions: bindActionCreators(modelsActions, dispatch),
  modelsThunks: bindActionCreators(modelsThunks, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ModelsPage)
