import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import { thunks as modelsThunks } from '../redux/models'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Menu, Icon } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */
const AppBar = ({ history, download, menuLinks }) => (
  <Menu size='small' icon='labeled' fixed='top'>
    {menuLinks.map(({ icon, label, ...props }) =>
      <Menu.Item key={label} {...props}>
        <Icon name={icon} />
        {label}
      </Menu.Item>
    )}
    <h1 className='site-title'>Sequelize UI</h1>
    <Menu.Item position='right' onClick={download}>
      <Icon name='download' />
      Export
    </Menu.Item>
    <Menu.Item
      href='https://github.com/tomjschuster/sequelize-ui'
      target='_blank'
      position='right'
    >
      <Icon name='github' />
      Github
    </Menu.Item>
  </Menu>
)

const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = { downloadTemplate: modelsThunks.downloadTemplate }

const mergeProps = ({ models }, {downloadTemplate}, ownProps) => ({
  download: downloadTemplate.bind(null, models),
  ...ownProps
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(AppBar)
