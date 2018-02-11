import React, { Component } from 'react'
import { connect } from 'react-redux'
import { requestDbDownload } from '../redux/models'

import AppBar from 'react-toolbox/lib/app_bar'
import FontIcon from 'react-toolbox/lib/font_icon'

export class App extends Component {
  render() {
    let { children, models } = this.props
    return (
      <div>
        <AppBar
          title="Sequelize UI"
          rightIcon={<FontIcon value="file_download" />}
          onRightIconClick={() => requestDbDownload(models)}
        />
        <div id="main">{children}</div>
      </div>
    )
  }
}

const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(App)
