import { combineReducers } from "redux";
import uiAppReducer from "./uiAppReducer";
import uiExportReducer from "./uiExportReducer";
import uiPaintReducer from "./uiPaintReducer";

const uiReducer = combineReducers({
  app: uiAppReducer,
  export: uiExportReducer,
  paint: uiPaintReducer
});

export default uiReducer;
