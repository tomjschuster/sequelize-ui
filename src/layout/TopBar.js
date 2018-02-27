import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import { thunks as modelsThunks } from '../redux/models'
import { actionCreators as uiActions } from '../redux/ui'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import AppBar from 'react-toolbox/lib/app_bar'
import FontIcon from 'react-toolbox/lib/font_icon'

/* ----------  COMPONENT  ---------- */
const TopBar = ({
  children,
  // State
  models,
  // Actions
  modelsThunks: { downloadTemplate },
  uiActions: { toggleSideBar }
}) => (
  <AppBar
    title='Sequelize UI'
    leftIcon={<FontIcon value='menu' />}
    rightIcon={<FontIcon value='file_download' />}
    onLeftIconClick={toggleSideBar}
    onRightIconClick={downloadTemplate.bind(null, models)}
  >
    {children}
  </AppBar>
)

/* ----------  CONNECT  ---------- */
const mapStateToProps = ({ models }) => ({ models })

const mapDispatchToProps = dispatch => ({
  modelsThunks: bindActionCreators(modelsThunks, dispatch),
  uiActions: bindActionCreators(uiActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TopBar)
