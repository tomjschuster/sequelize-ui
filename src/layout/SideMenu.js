import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { withRouter } from 'react-router-dom'

/* ----------  ACTION/THUNK CREATORS  ---------- */
import { thunks as modelsThunks } from '../redux/models'
import { actionCreators as menuActions } from '../redux/menu'
import { actionCreators as uiActions } from '../redux/ui'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Drawer from 'react-toolbox/lib/drawer'
import Link from 'react-toolbox/lib/link'
import Input from 'react-toolbox/lib/input'
import { List, ListItem } from 'react-toolbox/lib/list'
import { Button } from 'react-toolbox/lib/button'

/* ----------  COMPONENT  ---------- */
const ModelListItem = ({ modelId, name, isCurrent, gotoModel }) => (
  <ListItem
    ripple={false}
    className={isCurrent ? 'active' : ''}
    itemContent={
      <Link
        href={`/models/${modelId}`}
        onClick={evt => evt.preventDefault() || gotoModel()}
      >
        {name}
      </Link>
    }
  />
)

/* ----------  COMPONENT  ---------- */
class SideMenu extends Component {
  componentDidMount () {
    this.historyListener = this.props.history.listen(this.props.uiActions.closeSideBar)
  }

  componentWillUnmount () {
    this.historyListener.unlisten()
  }

  gotoModels = id => this.props.history.push('/models')
  gotoModel = id => this.props.history.push(`/models/${id}`)

  render () {
    const {
      // State
      currentId,
      menu,
      models,
      ui,
      // Actions
      menuActions: { updateMenuModelName, cancelMenuModel, addMenuModel },
      uiActions: { closeSideBar },
      // Thunks
      modelsThunks: { createModel }
    } = this.props
    return (
      <Drawer
        active={ui.sideBarIsOpen}
        type='left'
        onOverlayClick={closeSideBar}
      >
        <h2>Sequelize UI</h2>
        <List>
          <Link
            href='/models'
            onClick={evt => evt.preventDefault() || this.gotoModels()}
          >
            <h3>Models</h3>
          </Link>
          {models.map(model => (
            <ModelListItem
              key={model.id}
              modelId={model.id}
              name={model.name}
              isCurrent={model.id === currentId}
              gotoModel={this.gotoModel.bind(this, model.id)}
            />
          ))}
          {menu.newModelName !== null && (
            <div>
              <Input
                value={menu.newModelName || ''}
                onChange={updateMenuModelName}
              />
              <Button
                label='Create'
                onClick={createModel.bind(null, menu.newModelName)}
              />
              <Button label='Cancel' onClick={cancelMenuModel} />
            </div>
          )}
          {menu.newModelName === null && (
            <Button icon='add' floating mini onClick={addMenuModel} />
          )}
        </List>
      </Drawer>
    )
  }
}

const mapStateToProps = ({ currentModel, models, menu, ui }) => ({
  currentId: currentModel.id,
  menu,
  models,
  ui
})

const mapDispatchToProps = dispatch => ({
  menuActions: bindActionCreators(menuActions, dispatch),
  uiActions: bindActionCreators(uiActions, dispatch),
  modelsThunks: bindActionCreators(modelsThunks, dispatch)
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SideMenu)
