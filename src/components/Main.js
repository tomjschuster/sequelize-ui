import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
/* ----------  ACTION/THUNK CREATORS  ---------- */
import {
  actionCreators as modelsActions,
  thunks as modelsThunks
} from '../redux/models'
import { actionCreators as menuActions } from '../redux/menu'
import { actionCreators as currentModelActions } from '../redux/currentModel'
import { actionCreators as uiActions } from '../redux/ui'

/* ----------  APP COMPONENTS  ---------- */
import Sidebar from './Sidebar/Sidebar'
import CurrentModel from './CurrentModel/CurrentModel'
import ConfirmDialog from './ConfirmDialog'

/* ----------  COMPONENT  ---------- */
class Main extends Component {
  componentWillUnmount () {
    this.props.closeAllFields()
  }

  render () {
    const {
      models,
      menu,
      currentModel,
      ui,
      modelsActions,
      modelsThunks,
      currentModelActions,
      uiActions,
      menuActions
    } = this.props

    return (
      <div>
        <CurrentModel
          models={models}
          currentModel={currentModel}
          tabIdx={ui.currentModelTabIdx}
          fieldsToggle={ui.fieldsToggle}
          modelsThunks={modelsThunks}
          modelsActions={modelsActions}
          currentModelActions={currentModelActions}
          uiActions={uiActions}
        />
        <Sidebar
          currentId={currentModel.id}
          models={models}
          menu={menu}
          menuActions={menuActions}
          modelsActions={modelsActions}
          currentModelActions={currentModelActions}
          modelsThunks={modelsThunks}
        />
        <ConfirmDialog dialog={ui.dialog} closeDialog={uiActions.closeDialog} />
      </div>
    )
  }
}

/* ----------  CONNECT  ---------- */
const mapStateToProps = ({ models, menu, currentModel, ui }) => ({
  models,
  menu,
  currentModel,
  ui
})
const mapDispatchToProps = dispatch => ({
  modelsActions: bindActionCreators(modelsActions, dispatch),
  modelsThunks: bindActionCreators(modelsThunks, dispatch),
  currentModelActions: bindActionCreators(currentModelActions, dispatch),
  uiActions: bindActionCreators(uiActions, dispatch),
  menuActions: bindActionCreators(menuActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)
