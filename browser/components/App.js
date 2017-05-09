'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { requestDbDownload } from '../redux/models'

import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import NewFolder from 'material-ui/svg-icons/file/create-new-folder'

export class App extends Component {
  render() {
    let { children, models } = this.props
    return (
      <div>
          <AppBar title='Sequelize UI'
                  iconElementLeft={<IconButton><NewFolder /></IconButton>}
                  iconElementRight={
                    <FlatButton onClick={() => requestDbDownload(models)} label='Download Models'/>
                  }/>
        <div id='main'>
          { children }
        </div>
      </div>
    )
  }
}


const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = () => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
