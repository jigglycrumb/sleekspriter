import initialState from '../initialState';

function uiPaintReducer(state = initialState.ui.paint, action) {

  console.log(`uiPaintReducer#${action.type}`);

  switch (action.type) {
    case 'SELECT_TOOL':
      return { ...state, tool: action.tool };
    case 'TOGGLE_GRID':
      return { ...state, grid: !state.grid };

    default:
      return state;
  }
}

export default uiPaintReducer;
