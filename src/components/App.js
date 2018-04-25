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
import Schema from './Schema'
import ViewModel from './ViewModel'
import EditModel from './EditModel'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Menu, Icon, Container } from 'semantic-ui-react'
import styles from '../style/css/main.css'

/* ----------  COMPONENT  ---------- */
const AppMenu = ({ goHome, goToSchema, download }) => (
  <Menu size='small' icon='labeled'>
    <Menu.Item onClick={goToSchema}>
      <Icon name='cubes' />
      My Schema
    </Menu.Item>
    <h1 role='link' onClick={goHome} className={styles.siteTitle}>
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
      goToSchema={() => history.push('/schema')}
      download={download}
    />
    <Container>
      <Switch>
        <Route exact path='/schema/models/:id/edit' component={EditModel} />
        <Route exact path='/schema/models/:id' component={ViewModel} />
        <Route exact path='/schema' component={Schema} />
        <Route exact path='/' component={Home} />
        <Redirect to='/' />
      </Switch>
    </Container>
  </React.Fragment>
)

const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = { downloadTemplate: modelsThunks.downloadTemplate }

const mergeProps = ({ models }, {downloadTemplate}, ownProps) => ({
  download: downloadTemplate.bind(null, models),
  ...ownProps
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App)
