import React from 'react'
import { connect } from 'react-redux'

/*----------  ACTION THUNK CREATORS  ----------*/
import { requestDbDownload } from '../redux/models'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import AppBar from 'react-toolbox/lib/app_bar'
import FontIcon from 'react-toolbox/lib/font_icon'

/*----------  COMPONENT  ----------*/
const App = ({ children, models, downloadTemplate }) => (
  <div>
    <AppBar
      title="Sequelize UI"
      rightIcon={<FontIcon value="file_download" />}
      onRightIconClick={() => downloadTemplate(models)}
    />
    {children}
  </div>
)

/*----------  CONNECT  ----------*/
const mapStateToProps = ({ models }) => ({ models })

const mapDispatchToProps = dispatch => ({
  downloadTemplate: models => dispatch(requestDbDownload(models))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
