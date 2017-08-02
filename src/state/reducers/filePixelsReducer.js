import initialState from "../initialState";
import _ from "lodash";
import { Point } from "../../classes";
import {
  selectionIsActive
} from "../../utils";

const insideBounds = (bounds, point) =>
  bounds.start.x <= point.x &&
  bounds.start.y <= point.y &&
  bounds.end.x >= point.x &&
  bounds.end.y >= point.y;

function filePixelsReducer(state = initialState.file.pixels, action) {
  switch (action.type) {

  case "FILE_CREATE":
    return {};

  case "FILE_LOAD":
    return Object.assign({}, action.json.pixels);

  case "LAYER_DELETE": {
    let stateCopy = Object.assign({}, state);
    delete stateCopy[action.frame][action.layer];
    if(Object.keys(stateCopy[action.frame]).length === 0) delete stateCopy[action.frame];
    if(Object.keys(stateCopy).length === 0) stateCopy = {};
    return stateCopy;
  }

  case "LAYER_MERGE": {
    let stateCopy = Object.assign({}, state);

    if(stateCopy[action.frame]
    && stateCopy[action.frame][action.first]
    && stateCopy[action.frame][action.second]) {
      const
        first = stateCopy[action.frame][action.first],
        second = stateCopy[action.frame][action.second],
        merged = _.merge(second, first);

      delete stateCopy[action.frame][action.first];
      stateCopy[action.frame][action.second] = merged;
    }

    return stateCopy;
  }


  case "PIXELS_ADD": {
    if(state[action.frame] == undefined) state[action.frame] = {};
    if(state[action.frame][action.layer] == undefined) state[action.frame][action.layer] = {};

    const
      px = state[action.frame][action.layer],
      newPx = _.merge(px, action.pixels);

    return Object.assign({}, _.merge(state, {
      [action.frame]: {
        [action.layer]: newPx
      }
    }));
  }

  case "PIXELS_DELETE": {
    const stateCopy = Object.assign({}, state);

    Object.keys(action.pixels).map(x => {
      Object.keys(action.pixels[x]).map(y => {
        delete stateCopy[action.frame][action.layer][x][y];
      });

      if(Object.keys(stateCopy[action.frame][action.layer][x]).length === 0) {
        delete stateCopy[action.frame][action.layer][x];
      }
    });

    if(Object.keys(stateCopy[action.frame][action.layer]).length === 0) {
      delete stateCopy[action.frame][action.layer];
    }
    if(Object.keys(stateCopy[action.frame]).length === 0) {
      delete stateCopy[action.frame];
    }

    return stateCopy;
  }

  case "PIXELS_MOVE": {

    const stateCopy = Object.assign({}, state);
    const sizeBounds = {
      start: { x: 1, y: 1 },
      end: { x: action.size.width, y: action.size.height }
    };

    let newPixels = {};

    if(selectionIsActive(action.selection)) {
      console.log("selection active");

      // iterate over x-axis
      Object.keys(action.pixels).map(x => {
        // iterate over y-axis
        Object.keys(action.pixels[x]).map(y => {
          // grab a copy of the old pixel
          const oldPixel = action.pixels[x][y];
          // translate pixel coordinates to new position
          const p = new Point(x, y).translate(action.distance);
          // check if pixel was in selection and is still inside the file
          if(insideBounds(action.selection, oldPixel) && insideBounds(sizeBounds, p)) {
            // create new translated pixel
            if(!newPixels[p.x]) newPixels[p.x] = {};
            newPixels[p.x][p.y] = {
              frame: action.frame,
              layer: action.layer,
              x: p.x,
              y: p.y,
              r: oldPixel.r,
              g: oldPixel.g,
              b: oldPixel.b,
              z: oldPixel.z,
            };

            // delete old pixel
            delete stateCopy[action.frame][action.layer][x][y];
          }
        });
      });

      // merge new pixels with old ones
      const newLayerPixels = _.merge(stateCopy[action.frame][action.layer], newPixels);
      stateCopy[action.frame][action.layer] = newLayerPixels;
    }
    else {
      console.log("selection NOT active");

      // delete all pixels of the layer
      delete stateCopy[action.frame][action.layer];

      // iterate over x-axis
      Object.keys(action.pixels).map(x => {
        // iterate over y-axis
        Object.keys(action.pixels[x]).map(y => {
          // translate pixel coordinates to new position
          const p = new Point(x, y).translate(action.distance);
          // check if pixel is still inside the file
          if(insideBounds(sizeBounds, p)) {
            // create new translated pixel
            if(!newPixels[p.x]) newPixels[p.x] = {};
            newPixels[p.x][p.y] = {
              frame: action.frame,
              layer: action.layer,
              x: p.x,
              y: p.y,
              r: action.pixels[x][y].r,
              g: action.pixels[x][y].g,
              b: action.pixels[x][y].b,
              z: action.pixels[x][y].z,
            };
          }
        });
      });

      // merge new pixels back to state copy
      stateCopy[action.frame][action.layer] = newPixels;
    }

    return stateCopy;
  }

  default:
    return state;
  }
}

export default filePixelsReducer;
