import { combineReducers, createStore } from 'redux';
import {
  uiReducer,
  fileReducer
} from './reducers';

const rootReducer = combineReducers({
  ui: uiReducer,
  file: fileReducer,
});

export default createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
