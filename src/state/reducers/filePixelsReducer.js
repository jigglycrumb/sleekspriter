import initialState from "../initialState";
import _ from "lodash";
import { Point, Pixel } from "../../classes";
import {
  createBounds,
  insideBounds,
  selectionIsActive
} from "../../utils";

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

  case "PIXELS_ADD":
  case "PIXELS_PASTE": {
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

  case "PIXELS_CUT":
  case "PIXELS_DELETE": {
    const { frame, layer, pixels } = action;
    let stateCopy = _.cloneDeep(state);
    stateCopy = deletePixels(stateCopy, frame, layer, pixels);
    return stateCopy;
  }

  case "PIXELS_MOVE": {
    let stateCopy = Object.assign({}, state);
    const sizeBounds = {
      start: { x: 1, y: 1 },
      end: { x: action.size.width, y: action.size.height }
    };

    let newPixels = {};

    if(selectionIsActive(action.selection)) {
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

  case "PIXELS_ROTATE": {

    let stateCopy = _.cloneDeep(state);
    const { frame, layer, pixels, angle, pivot, size } = action;
    const bounds = createBounds(size);
    const newPixels = manipulatePixels(pixels, rotatePixel.bind(this, angle, pivot, bounds));

    deletePixels(stateCopy, frame, layer, pixels);
    return _.merge(stateCopy, {
      [frame]: {
        [layer]: newPixels
      }
    });
  }

  default:
    return state;
  }
}

export default filePixelsReducer;



// helper functions

function deletePixels(state, frame, layer, pixels) {

  Object.keys(pixels).map(x => {
    Object.keys(pixels[x]).map(y => {
      // console.log("delete! ", frame, layer, x, y);
      delete state[frame][layer][x][y];
    });

    if(Object.keys(state[frame][layer][x]).length === 0) {
      // console.log("delete! ", frame, layer, x);
      delete state[frame][layer][x];
    }
  });

  if(Object.keys(state[frame][layer]).length === 0) {
    // console.log("delete! ", frame, layer);
    delete state[frame][layer];
  }
  if(Object.keys(state[frame]).length === 0) {
    // console.log("delete! ", frame);
    delete state[frame];
  }

  return state;
}

function rotatePixel(angle, pivot, bounds, pixel) {
  pixel.rotate(angle, pivot);
  if(insideBounds(bounds, pixel)) return pixel;
  else return false;
}

function flattenPixels(pixels) {
  let pixelArray = [];
  Object.keys(pixels).map(x => {
    Object.keys(pixels[x]).map(y => {
      const { frame, layer, r, g, b, a } = pixels[x][y];
      pixelArray.push(new Pixel(frame, layer, x, y, r, g, b, a));
    });
  });
  return pixelArray;
}

function inflatePixels(pixels) {
  let pixelMap = {};
  pixels.forEach(pixel => {
    if(!pixelMap[pixel.x]) pixelMap[pixel.x] = {};
    pixelMap[pixel.x][pixel.y] = pixel;
  });
  return pixelMap;
}

function manipulatePixels(pixels, callback) {
  pixels = flattenPixels(pixels);
  pixels.forEach(callback, this);
  pixels = inflatePixels(pixels);
  return pixels;
}
