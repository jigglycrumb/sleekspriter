import initialState from './initialState';

function reducer(state = initialState, action) {

  // console.log(action);

  switch (action.type) {
    /*
    case 'RESTORE_STATE':
      return Object.assign({}, state, action.state);
    case 'SEARCH_SUCCESS':
      return Object.assign({}, state, { show: null, search: { query: action.query, results: action.results }});
    case 'SELECT_LANGUAGE':
      return { ...state, language: action.language };
    case 'SELECT_SEASON':
      return { ...state, season: action.season };
    case 'SELECT_SHOW':
      return Object.assign({}, state, { show: action.id, language: 'en', season: 1, search: { query: "", results: [] }});
    case 'LOAD_INFO_SUCCESS':
      // Guess season zerofill
      var zerofill = [(""+action.info.seasons.length).length-1, state.zerofill[1]];
      return Object.assign({}, state, {showLoaded: true, showdata: {info: action.info, translations: state.showdata.translations}, zerofill: zerofill});
    case 'LOAD_TRANSLATIONS_SUCCESS':
      return Object.assign({}, state, {showdata: {info: state.showdata.info, translations: action.translations}});
    case 'LOAD_EPISODES_SUCCESS':
      return { ...state, episodes: action.episodes };
    case 'SET_ZEROFILL':
      return { ...state, zerofill: action.zerofill };
    case 'SET_SPACE':
      return { ...state, space: action.space };
    case 'SET_EPISODE_FORMAT':
      return { ...state, format: action.format };
*/
    default:
      return state;
  }
}

export default reducer;
