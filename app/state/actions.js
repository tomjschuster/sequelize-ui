import { bindActionCreators } from 'redux'
import { actions as demo } from './branches/demo'
import store from './store'

const actions = {
  demo
}

export default Object.keys(actions).reduce((acc, branch) => ({
  ...acc, [branch]: bindActionCreators(actions[branch], store.dispatch)
}), {})

