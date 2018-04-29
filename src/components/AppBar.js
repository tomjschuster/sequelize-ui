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
class AppBar extends React.Component {
  static StandardButtons = ({ download, position = null }) =>
    <React.Fragment>
      <Menu.Item position={position} onClick={download}>
        <Icon name='download' />
          Export
      </Menu.Item>
      <Menu.Item
        href='https://github.com/tomjschuster/sequelize-ui'
        target='_blank'
        position={position}
      >
        <Icon name='github' />
          Github
      </Menu.Item>
    </React.Fragment>

  static MenuLinks = ({ links }) =>
    <React.Fragment>
      {links.map(({ icon, label, ...props }) =>
        <Menu.Item key={label} {...props}>
          <Icon name={icon} />
          {label}
        </Menu.Item>
      )}
    </React.Fragment>

  render () {
    const { media, download, menuLinks } = this.props
    if (media.mobile) {
      return (
        <React.Fragment>
          <Menu size='small' icon='labeled' fixed='top'>
            <AppBar.MenuLinks links={menuLinks} />
            <h1 id='site-title' className='mobile'>SUI</h1>
          </Menu>
          <Menu size='small' icon='labeled' widths={2} fixed='bottom'>
            <AppBar.StandardButtons download={download} />
          </Menu>
        </React.Fragment>
      )
    } else {
      return (
        <Menu size='small' icon='labeled' fixed='top'>
          <AppBar.MenuLinks links={menuLinks} />
          <h1 id='site-title'>Sequelize UI</h1>
          <AppBar.StandardButtons download={download} position='right' />
        </Menu>
      )
    }
  }
}

const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = { downloadTemplate: modelsThunks.downloadTemplate }

const mergeProps = ({ models }, {downloadTemplate}, ownProps) => ({
  download: downloadTemplate.bind(null, models),
  ...ownProps
})

export default compose(
  withRouter,
  withMedia,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(AppBar)
