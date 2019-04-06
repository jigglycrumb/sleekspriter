import _ from "lodash";
import sprout from "sprout-data";

import initialState from "../initialState";
import { Point } from "../../classes";
import config from "../../config";

import { deletePixels, flattenPixels, mergeLayerPixels } from "../../utils";
const { zoom, offset } = config;

function uiPaintReducer(state = initialState.ui.paint, action) {
  // console.log(`uiPaintReducer#${action.type}`);

  switch (action.type) {
    case "BRIGHTNESSTOOL_INTENSITY":
      return {
        ...state,
        brightnessTool: {
          mode: state.brightnessTool.mode,
          intensity: +action.intensity,
        },
      };
    case "BRIGHTNESSTOOL_MODE":
      return {
        ...state,
        brightnessTool: {
          mode: action.mode,
          intensity: state.brightnessTool.intensity,
        },
      };
    case "BOX_FOLD":
      return {
        ...state,
        fold: { ...state.fold, [action.box]: !state.fold[action.box] },
      };
    case "BRUSH_COLOR":
      return { ...state, color: action.color };
    case "FILE_CREATE":
      return {
        ...state,
        frame: 1,
        layer: null,
        onion: {
          ...state.onion,
          frame: { fixed: 1, relative: 1 },
        },
        selection: { start: null, end: null },
        zoom: 10,
      };
    case "FILE_LOAD": {
      const spritePalette = _.uniq(
        flattenPixels(action.json.pixels).map(p => p.toHex())
      );
      return {
        ...state,
        frame: 1,
        layer: null,
        onion: {
          ...state.onion,
          frame: { fixed: 1, relative: 1 },
        },
        selection: { start: null, end: null },
        spritePalette,
        zoom: 10,
      };
    }
    case "FRAME_SELECT":
      return { ...state, frame: +action.frame, layer: null };
    case "GRID_TOGGLE":
      return { ...state, grid: !state.grid };

    case "LAYER_ADD": {
      return { ...state, layer: action.newLayerId };
    }

    case "LAYER_DELETE": {
      const { allPixels, frame, layer } = action;
      let pixels = _.cloneDeep(allPixels);
      pixels = sprout.dissoc(pixels, [frame, layer]);
      const spritePalette = _.uniq(flattenPixels(pixels).map(p => p.toHex()));
      return { ...state, spritePalette, layer: null };
    }

    case "LAYER_MERGE": {
      const { frame, first, second, allPixels } = action;

      let pixels = _.cloneDeep(allPixels);
      pixels = mergeLayerPixels(frame, first, second, pixels);

      const spritePalette = _.uniq(flattenPixels(pixels).map(p => p.toHex()));
      return { ...state, spritePalette, layer: null };
    }

    case "LAYER_SELECT":
      return { ...state, layer: +action.layer };
    case "LAYER_SELECT_TOP": {
      const layer = _.max(action.layers, function(layer) {
        return layer.z;
      });
      return { ...state, layer: layer.id };
    }
    case "ONION_FRAME":
      return {
        ...state,
        onion: {
          ...state.onion,
          frame: { ...state.onion.frame, [action.mode]: +action.frame },
        },
      };
    case "ONION_MODE":
      return { ...state, onion: { ...state.onion, mode: action.mode } };
    case "ONION_TOGGLE":
      return {
        ...state,
        onion: { ...state.onion, active: !state.onion.active },
      };
    case "PALETTE_SELECT":
      return { ...state, palette: +action.palette };

    case "PIXELS_ADD":
    case "PIXELS_PASTE": {
      const colors = _.uniq(flattenPixels(action.pixels).map(p => p.toHex()));
      const spritePalette = _.uniq([...state.spritePalette, ...colors]);
      return { ...state, spritePalette };
    }

    case "PIXELS_COPY": {
      const clipboard = action.pixels;
      return { ...state, clipboard };
    }

    case "PIXELS_CUT": {
      const { allPixels, frame, layer, pixels } = action;
      const pixelMap = deletePixels(allPixels, frame, layer, pixels);
      const clipboard = action.pixels;
      const spritePalette = _.uniq(flattenPixels(pixelMap).map(p => p.toHex()));
      return { ...state, clipboard, spritePalette };
    }

    case "PIXELS_DELETE": {
      const { allPixels, frame, layer, pixels } = action;
      const pixelMap = deletePixels(allPixels, frame, layer, pixels);
      const spritePalette = _.uniq(flattenPixels(pixelMap).map(p => p.toHex()));
      return { ...state, spritePalette };
    }

    case "SELECTION_CLEAR":
      return { ...state, selection: { start: null, end: null } };

    case "SELECTION_MOVE":
      return {
        ...state,
        selection: {
          start: new Point(
            state.selection.start.x,
            state.selection.start.y
          ).translate(action.distance),
          end: new Point(
            state.selection.end.x,
            state.selection.end.y
          ).translate(action.distance),
        },
      };
    case "SELECTION_END":
      // TODO: switch start & end if end < start
      return { ...state, selection: { ...state.selection, end: action.point } };
    case "SELECTION_START":
      return {
        ...state,
        selection: { ...state.selection, start: action.point },
      };
    case "TOOL_SELECT":
      return { ...state, tool: action.tool };
    case "ZOOM_IN": {
      let newZoom = state.zoom + 1;
      if (newZoom > zoom.max) newZoom = zoom.max;
      return { ...state, zoom: newZoom };
    }
    case "ZOOM_OUT": {
      let newZoom = state.zoom - 1;
      if (newZoom < zoom.min) newZoom = zoom.min;
      return { ...state, zoom: newZoom };
    }
    case "ZOOM_SELECT":
      return { ...state, zoom: +action.zoom };
    case "ZOOM_FIT": {
      let newZoom = Math.floor(
        (window.innerHeight - offset.top - offset.bottom) /
          action.fileSize.height
      );
      if (
        action.fileSize.width * newZoom >
        window.innerWidth - offset.left - offset.right
      ) {
        newZoom = Math.floor(
          (window.innerWidth - offset.left - offset.right) /
            action.fileSize.width
        );
      }
      return { ...state, zoom: newZoom };
    }
    default:
      return state;
  }
}

export default uiPaintReducer;
