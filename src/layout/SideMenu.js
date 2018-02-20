import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

/* ----------  ACTION/THUNK CREATORS  ---------- */
import { thunks as modelsThunks } from '../redux/models'
import { actionCreators as menuActions } from '../redux/menu'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import Drawer from 'react-toolbox/lib/drawer'
import Link from 'react-toolbox/lib/link'
import Input from 'react-toolbox/lib/input'
import { List, ListItem } from 'react-toolbox/lib/list'
import { Button, IconButton } from 'react-toolbox/lib/button'

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
  gotoModels = id => this.props.router.push('/models')
  gotoModel = id => this.props.router.push(`/models/${id}`)

  render () {
    const {
      // State
      currentId,
      menu,
      models,
      // Actions
      menuActions: {
        updateMenuModelName,
        cancelMenuModel,
        addMenuModel,
        closeMenu
      },
      // Thunks
      modelsThunks: { saveModel }
    } = this.props
    return (
      <Drawer active={menu.isOpen} type='left' onOverlayClick={closeMenu}>
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
          {menu.newModel && (
            <div>
              <Input
                value={menu.newModel.name || ''}
                onChange={updateMenuModelName}
              />
              <Button
                label='Create'
                onClick={saveModel.bind(null, menu.newModel, models, true)}
              />
              <Button label='Cancel' onClick={cancelMenuModel} />
            </div>
          )}
          {!menu.newModel && (
            <Button icon='add' floating mini onClick={addMenuModel} />
          )}
        </List>
      </Drawer>
    )
  }
}

const mapStateToProps = ({ currentModel, models, menu }) => ({
  currentId: currentModel.id,
  menu,
  models
})

const mapDispatchToProps = dispatch => ({
  menuActions: bindActionCreators(menuActions, dispatch),
  modelsThunks: bindActionCreators(modelsThunks, dispatch)
})

const SideMenuWithRouter = withRouter(SideMenu, { withRef: true })

export default connect(mapStateToProps, mapDispatchToProps)(SideMenuWithRouter)
