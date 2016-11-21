import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import persistState from 'redux-localstorage';

import reducer from './redux';


const middleware = applyMiddleware(thunkMiddleware);

const enhancer = compose(middleware, persistState('models'));

export default createStore(reducer, middleware);
