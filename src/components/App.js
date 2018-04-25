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
import Schema from './Schema'
import ViewModel from './ViewModel'
import EditModel from './EditModel'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Menu, Container } from 'semantic-ui-react'
import styles from '../style/css/main.css'

/* ----------  COMPONENT  ---------- */
const AppMenu = ({ goHome, download }) => (
  <Menu size='small' icon='labeled'>
    <Menu.Item icon='cubes' onClick={goHome} />
    <h1 className={styles.siteTitle}>Sequelize UI</h1>
    <Menu.Item icon='download' position='right' onClick={download} />
  </Menu>
)

const App = ({ history, download }) => (
  <React.Fragment>
    <AppMenu goHome={() => history.push('/')} download={download} />
    <Container>
      <Switch>
        <Route exact path='/:id/edit' component={EditModel} />
        <Route exact path='/:id' component={ViewModel} />
        <Route exact path='/' component={Schema} />
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
