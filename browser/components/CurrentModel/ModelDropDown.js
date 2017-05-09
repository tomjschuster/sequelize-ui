'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import upperCamelCase from 'uppercamelcase'

/*----------  LIBRARY COMPONENTS  ----------*/
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'

/*----------  COMPONENT  ----------*/
export class ModelDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {open: false, current: null}
    this.openMenu = this.openMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }

  openMenu() {
    this.setState({open: true})
  }

  closeMenu() {
    this.setState({ open: false })
  }

  render() {
    let { modelList, onClick, idx, valueKey } = this.props
    let { open } = this.state
    let { openMenu, closeMenu, setCurrent } = this
    return (
    <IconMenu
      open={open}
      iconButtonElement={
        <FlatButton
          label={valueKey || 'Select Model'}
          onClick={openMenu}
          labelStyle={{textTransform: 'none'}}
        />
      }
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
    >
      { modelList.map((model, modelIdx) => (
        <MenuItem
          key={modelIdx}
          primaryText={model.valueKey}
          onClick={() => {
            closeMenu()
            onClick(model.valueKey, idx)
            setCurrent(model.valueKey)
          }}
        />
      ))}
    </IconMenu>
    )
  }
}


/*----------  CONNECT  ----------*/
const mapStateToProps = ({ models }) => {
  let modelList = models.map(model => ({valueKey: upperCamelCase(model.name)}))
  return { modelList }
}
const mapDispatchToProps = dispatch => ({ })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelDropdown)
