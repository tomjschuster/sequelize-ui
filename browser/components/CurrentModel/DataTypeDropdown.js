'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

/*----------  LIBRARY COMPONENTS  ----------*/
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'

/*----------  CONSTANTS  ----------*/
const sequelizeDataTypes = [
  {textKey: 'String', valueKey: 'STRING'},
  {textKey: 'Text', valueKey: 'TEXT'},
  {textKey: 'Integer', valueKey: 'INTEGER'},
  {textKey: 'Float', valueKey: 'FLOAT'},
  {textKey: 'Real', valueKey: 'REAL'},
  {textKey: 'Double', valueKey: 'DOUBLE'},
  {textKey: 'Decimal', valueKey: 'DECIMAL'},
  {textKey: 'Date', valueKey: 'DATE'},
  {textKey: 'Date (without time)', valueKey: 'DATEONLY'},
  {textKey: 'Boolean', valueKey: 'BOOLEAN'},
  {textKey: 'Array', valueKey: 'ARRAY'},
  {textKey: 'JSON', valueKey: 'JSON'},
  {textKey: 'BLOB', valueKey: 'BLOB'},
  {textKey: 'UUID', valueKey: 'UUID'},
]

const dataSourceConfig = {
  text: 'textKey',
  value: 'valueKey',
}

/*----------  COMPONENT  ----------*/
export class DataTypeDropDown extends Component {
  constructor(props) {
    super(props)
    this.state = {open: false}
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
    let { currType, idx, onClick } = this.props
    let { open } = this.state
    let { openMenu, closeMenu } = this
    return (
    <IconMenu
      open={open}
      iconButtonElement={
        <FlatButton
          label={currType || 'Data Type'}
          onClick={openMenu}
        />
      }
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}>
        {sequelizeDataTypes.map((dataType, i) => (
          <MenuItem
            key={i}
            primaryText={dataType.textKey}
            onClick={() => {
              closeMenu()
              onClick('type', dataType.valueKey, idx)
            }}
          />
          ))}
    </IconMenu>
    )
  }
}


/*----------  CONNECT  ----------*/
const mapStateToProps = state => ({ })
const mapDispatchToProps = dispatch => ({ })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataTypeDropDown)
