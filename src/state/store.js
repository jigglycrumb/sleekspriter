import { combineReducers, createStore } from 'redux';
import uiReducer from './reducers/uiReducer';

const rootReducer = combineReducers({
  ui: uiReducer
});

export default createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
