import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import { withMedia } from 'react-media-query-hoc'

/* ----------  ACTION THUNK CREATORS  ---------- */
import { thunks as modelsThunks } from '../redux/models'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Menu, Icon } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */
const StandardButtons = ({ download }) =>
  <React.Fragment>
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
  </React.Fragment>

const MenuLinks = ({ links }) =>
  <React.Fragment>
    {links.map(({ icon, label, ...props }) =>
      <Menu.Item key={label} {...props}>
        <Icon name={icon} />
        {label}
      </Menu.Item>
    )}
  </React.Fragment>

const AppBar = ({ media, download, menuLinks }) => {
  if (media.mobile) {
    return (
      <React.Fragment>
        <Menu fixed='top'>
          <h1 className='site-title'>Sequelize UI</h1>
        </Menu>
        <Menu size='small' icon='labeled' fluid fixed='bottom'>
          <MenuLinks links={menuLinks} />
          <div className='menu-link-separator' />
          <StandardButtons download={download} />
        </Menu>
      </React.Fragment>
    )
  } else {
    return (
      <Menu size='small' icon='labeled' fixed='top'>
        <MenuLinks links={menuLinks} />
        <h1 className='site-title'>Sequelize UI</h1>
        <StandardButtons download={download} />
      </Menu>
    )
  }
}

const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = { downloadTemplate: modelsThunks.downloadTemplate }

const mergeProps = ({ models: { models } }, {downloadTemplate}, ownProps) => ({
  download: downloadTemplate.bind(null, models),
  ...ownProps
})

export default compose(
  withMedia,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(AppBar)
