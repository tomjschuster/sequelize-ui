import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import reducer from './redux';

export default createStore(reducer, applyMiddleware(createLogger(), thunkMiddleware));
