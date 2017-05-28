import { combineReducers, createStore } from 'redux';
import uiReducer from './reducers/uiReducer';
import fileReducer from './reducers/fileReducer';

const rootReducer = combineReducers({
  ui: uiReducer,
  file: fileReducer,
});

export default createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
