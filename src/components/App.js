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
import { Menu } from 'semantic-ui-react'

/* ----------  COMPONENT  ---------- */
class App extends React.Component {
  goHome = () => this.props.history.push('/')
  goToModels = () => this.props.history.push('/models')

  render () {
    return (
      <React.Fragment>
        <Menu>
          <Menu.Item header onClick={this.goHome}>Sequelize UI</Menu.Item>
          <Menu.Item onClick={this.goToModels}>Models</Menu.Item>
          <Menu.Item icon='download' onClick={this.props.download} />
        </Menu>
        <Switch>
          <Route path='/models/:id/edit' component={EditModel} />
          <Route path='/models/:id' component={ViewModel} />
          <Route path='/models' component={Models} />
          <Route path='/' component={Home} />
          <Redirect to='/' />
        </Switch>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = { downloadTemplate: modelsThunks.downloadTemplate }

const mergeProps = ({ models }, {downloadTemplate}, ownProps) => ({
  download: downloadTemplate.bind(null, models),
  ...ownProps
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App)
