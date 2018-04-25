import React from 'react'
import { connect } from 'react-redux'
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

/* ----------  ACTION THUNK CREATORS  ---------- */
import { thunks as modelsThunks } from '../redux/models'

/* ----------  APP COMPONENTS  ---------- */
import Home from './Home'
import Models from './Models'
import ViewModel from './ViewModel'
import EditModel from './EditModel'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Menu, Icon } from 'semantic-ui-react'
import styles from '../style/css/main.css'

/* ----------  COMPONENT  ---------- */
const AppMenu = ({ goHome, goToModels, download }) => (
  <Menu size='small' icon='labeled'>
    <Menu.Item onClick={goHome}>
      <Icon name='home' />
      Home
    </Menu.Item>
    <Menu.Item onClick={goToModels}>
      <Icon name='cubes' />
      Models
    </Menu.Item>
    <h1 className={styles.siteTitle}>
      Sequelize UI
    </h1>
    <Menu.Item position='right' onClick={download}>
      <Icon name='download' />
      Download Schema
    </Menu.Item>
  </Menu>
)

const App = ({ history, download }) => (
  <React.Fragment>
    <AppMenu
      goHome={() => history.push('/')}
      goToModels={() => history.push('/models')}
      download={download}
    />
    <Switch>
      <Route path='/models/:id/edit' component={EditModel} />
      <Route path='/models/:id' component={ViewModel} />
      <Route path='/models' component={Models} />
      <Route path='/' component={Home} />
      <Redirect to='/' />
    </Switch>
  </React.Fragment>
)

const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = { downloadTemplate: modelsThunks.downloadTemplate }

const mergeProps = ({ models }, {downloadTemplate}, ownProps) => ({
  download: downloadTemplate.bind(null, models),
  ...ownProps
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App)
