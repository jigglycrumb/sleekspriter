import initialState from "../initialState";
import { setWindowTitle } from "../../utils";
import config from "../../config";

function uiAppReducer(state = initialState.ui.app, action) {
  switch (action.type) {
    case "FILE_CREATE": {
      if (PLATFORM === "electron") {
        setWindowTitle(config.defaultName, false);
      }

      return {
        ...state,
        file: {
          folder: false,
          name: false,
          dirty: false,
        },
      };
    }

    case "FILE_DIRTY": {
      if (PLATFORM === "electron") {
        setWindowTitle(state.file.name, action.dirty);
      }

      return { ...state, file: { ...state.file, dirty: action.dirty } };
    }
    case "FILE_INFO": {
      if (PLATFORM === "electron") {
        setWindowTitle(action.name, state.file.dirty);
      }

      return {
        ...state,
        file: {
          dirty: state.file.dirty,
          folder: action.folder,
          name: action.name,
        },
      };
    }
    case "MODAL_HIDE":
      return { ...state, modal: { visible: false, dialog: null } };
    case "MODAL_SHOW":
      return { ...state, modal: { visible: true, dialog: action.dialog } };
    case "SCREEN_SELECT":
      return { ...state, screen: action.screen };
    default:
      return state;
  }
}

export default uiAppReducer;
