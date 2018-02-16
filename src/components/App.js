import React from 'react'
import { connect } from 'react-redux'

/*----------  ACTION THUNK CREATORS  ----------*/
import { downloadTemplate } from '../redux/models'
import { toggleMenusList } from '../redux/ui'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import AppBar from 'react-toolbox/lib/app_bar'
import FontIcon from 'react-toolbox/lib/font_icon'

/*----------  COMPONENT  ----------*/
const App = ({ children, models, downloadTemplate, toggleMenusList }) => (
  <div>
    <AppBar
      title="Sequelize UI"
      leftIcon={<FontIcon value="menu" />}
      rightIcon={<FontIcon value="file_download" />}
      onLeftIconClick={toggleMenusList}
      onRightIconClick={downloadTemplate.bind(null, models)}
    />
    {children}
  </div>
)

/*----------  CONNECT  ----------*/
const mapStateToProps = ({ models }) => ({ models })

const mapDispatchToProps = { downloadTemplate, toggleMenusList }

export default connect(mapStateToProps, mapDispatchToProps)(App)
