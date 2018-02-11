import React from 'react'
import { connect } from 'react-redux'
import { requestDbDownload } from '../redux/models'

import AppBar from 'react-toolbox/lib/app_bar'
import FontIcon from 'react-toolbox/lib/font_icon'

const App = ({ children, models }) => (
  <div>
    <AppBar
      title="Sequelize UI"
      rightIcon={<FontIcon value="file_download" />}
      onRightIconClick={() => requestDbDownload(models)}
    />
    {children}
  </div>
)

const mapStateToProps = ({ models }) => ({ models: models.models })

export default connect(mapStateToProps)(App)
