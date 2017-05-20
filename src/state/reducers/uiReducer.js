import { combineReducers } from 'redux';
import uiPaintReducer from './uiPaintReducer';

const uiReducer = combineReducers({
  paint: uiPaintReducer
});

export default uiReducer;
