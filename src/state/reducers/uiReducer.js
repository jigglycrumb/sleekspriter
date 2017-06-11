import { combineReducers } from "redux";
import uiAppReducer from "./uiAppReducer";
import uiPaintReducer from "./uiPaintReducer";

const uiReducer = combineReducers({
  app: uiAppReducer,
  paint: uiPaintReducer
});

export default uiReducer;
