import initialState from "../initialState";

const initialMeta = initialState.file.present.meta;

function fileMetaReducer(state = initialMeta, action) {
  const now = new Date().toISOString();

  switch (action.type) {
    case "FILE_CREATE":
      return { ...initialMeta, created: now, updated: now };

    case "FILE_LOAD":
      return { ...initialMeta, ...action.json.meta };

    case "FILE_SAVE":
      return { ...state, updated: now };

    default:
      return state;
  }
}

export default fileMetaReducer;
