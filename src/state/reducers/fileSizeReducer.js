import initialState from '../initialState';
import config from '../../config';

const { zoom, offset } = config;

function fileSizeReducer(state = initialState.file.size, action) {

  // console.log(`fileSizeReducer#${action.type}`);

  switch (action.type) {

    default:
      return state;
  }
}

export default fileSizeReducer;
