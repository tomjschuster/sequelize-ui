'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { find } from 'lodash'

/*----------  LIBRARY COMPONENTS  ----------*/
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'

/*----------  CONSTANTS  ----------*/
const relationships = [
  {textKey: 'Belongs To', valueKey: 'belongsTo'},
  {textKey: 'Has One', valueKey: 'hasOne'},
  {textKey: 'Has Many', valueKey: 'hasMany'},
  {textKey: 'Belongs To Many', valueKey: 'belongsToMany'},
]

/*----------  COMPONENT  ----------*/
export class RelationshipDropDown extends Component {
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
    let { onClick, idx, valueKey } = this.props
    let { open } = this.state
    let { openMenu, closeMenu, setCurrent } = this
    return (
    <IconMenu
      open={open}
      iconButtonElement={
        <FlatButton
          label={valueKey ? find(relationships, {valueKey}).textKey : 'Select Relationship'}
          onClick={openMenu}
          labelStyle={{textTransform: 'none'}} />
      }
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}>
        {relationships.map((relationship, menuIdx) => (
          <MenuItem
            key={menuIdx}
            primaryText={relationship.textKey}
            onClick={() => {
              closeMenu()
              onClick(relationship.valueKey, idx)
              setCurrent(relationship.textKey)
            }} />
          ))}
    </IconMenu>
    )
  }
}


/*----------  CONNECT  ----------*/
const mapStateToProps = ({}) => ({})
const mapDispatchToProps = dispatch => ({ })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationshipDropDown)
