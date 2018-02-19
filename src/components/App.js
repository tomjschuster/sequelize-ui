import React from 'react'
import { connect } from 'react-redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import { downloadTemplate } from '../redux/models'
import { toggleMenu } from '../redux/menu'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import AppBar from 'react-toolbox/lib/app_bar'
import FontIcon from 'react-toolbox/lib/font_icon'

/* ----------  COMPONENT  ---------- */
const App = ({ children, models, downloadTemplate, toggleMenu }) => (
  <div>
    <AppBar
      title='Sequelize UI'
      leftIcon={<FontIcon value='menu' />}
      rightIcon={<FontIcon value='file_download' />}
      onLeftIconClick={toggleMenu}
      onRightIconClick={downloadTemplate.bind(null, models)}
    />
    {children}
  </div>
)

/* ----------  CONNECT  ---------- */
const mapStateToProps = ({ models }) => ({ models })

const mapDispatchToProps = { downloadTemplate, toggleMenu }

export default connect(mapStateToProps, mapDispatchToProps)(App)
