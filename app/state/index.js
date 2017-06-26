import { connect } from 'react-redux'
import store from './store'
import actions from './actions'

const allActions = Object.values(actions).reduce((acc, curr) => ({
  ...acc, ...curr
}), {})

const connectAll = connect(state => state, allActions)

export { store, actions, connectAll }
