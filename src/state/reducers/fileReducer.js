import { combineReducers } from 'redux';
import fileSizeReducer from './fileSizeReducer';

const fileReducer = combineReducers({
  size: fileSizeReducer
});

export default fileReducer;
