import { combineReducers, createStore } from "redux";
import {
  cacheReducer,
  fileReducer,
  uiReducer,
} from "./reducers";

const rootReducer = combineReducers({
  cache: cacheReducer,
  file: fileReducer,
  ui: uiReducer,
});

export default createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
