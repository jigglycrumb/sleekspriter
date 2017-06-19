import { combineReducers, createStore } from "redux";
import {
  fileReducer,
  uiReducer,
} from "./reducers";

const rootReducer = combineReducers({
  file: fileReducer,
  ui: uiReducer,
});

export default createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
