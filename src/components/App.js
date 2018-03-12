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
import EditModel from './EditModel'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Layout, Panel } from 'react-toolbox/lib/layout'
import AppBar from 'react-toolbox/lib/app_bar'
import FontIcon from 'react-toolbox/lib/font_icon'

/* ----------  COMPONENT  ---------- */

const App = ({ download }) => (
  <Layout>
    <Panel>
      <AppBar
        title='Sequelize UI'
        rightIcon={<FontIcon value='file_download' />}
        onRightIconClick={download}
      />
      <Switch>
        <Route path='/models/:id' component={EditModel} />
        <Route path='/models' component={Models} />
        <Route path='/' component={Home} />
        <Redirect to='/' />
      </Switch>
    </Panel>
  </Layout>
)

const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = { downloadTemplate: modelsThunks.downloadTemplate }

const mergeProps = ({ models }, {downloadTemplate}, ownProps) => ({
  download: downloadTemplate.bind(null, models),
  ...ownProps
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App)
