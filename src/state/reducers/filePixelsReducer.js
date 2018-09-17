import initialState from "../initialState";
import _ from "lodash";
import sprout from "sprout-data";
import {
  createBounds,
  deletePixels,
  duplicateLayers,
  flattenPixels,
  insideBounds,
  mergeLayerPixels,
} from "../../utils";

function filePixelsReducer(state = initialState.file.present.pixels, action) {
  switch (action.type) {
    case "FILE_CREATE":
      return {};

    case "FILE_LOAD":
      return action.json.pixels;

    case "FILE_SIZE": {
      // TODO implement this
      return state;
    }

    case "FRAME_DUPLICATE": {
      const { layers, source, target, nextLayerId } = action;
      const pixelsToDuplicate = sprout.get(state, [source], {});
      const newLayers = duplicateLayers(layers, target, nextLayerId);

      let layerMap = {};
      layers.map((layer, index) => {
        layerMap[layer.id] = newLayers[index].id;
      });

      const newPixels = manipulateFramePixels(
        pixelsToDuplicate,
        copyPixelToFrame.bind(this, target, layerMap)
      );
      state = sprout.dissoc(state, [target]);
      return sprout.assoc(state, [target], newPixels);
    }

    case "FRAME_FLIP_HORIZONTAL": {
      const { frame, pixels, pivot, size } = action;
      const bounds = createBounds(size);
      const newPixels = manipulateFramePixels(
        pixels,
        flipPixelHorizontal.bind(this, pivot, bounds)
      );

      state = sprout.dissoc(state, [frame]);
      return sprout.assoc(state, [frame], newPixels);
    }

    case "FRAME_FLIP_VERTICAL": {
      const { frame, pixels, pivot, size } = action;
      const bounds = createBounds(size);
      const newPixels = manipulateFramePixels(
        pixels,
        flipPixelVertical.bind(this, pivot, bounds)
      );

      state = sprout.dissoc(state, [frame]);
      return sprout.assoc(state, [frame], newPixels);
    }

    case "FRAME_ROTATE": {
      const { frame, pixels, angle, pivot, size } = action;
      const bounds = createBounds(size);
      const newPixels = manipulateFramePixels(
        pixels,
        rotatePixel.bind(this, angle, pivot, bounds)
      );

      state = sprout.dissoc(state, [frame]);
      return sprout.assoc(state, [frame], newPixels);
    }

    case "LAYER_DELETE": {
      return sprout.dissoc(state, [action.frame, action.layer]);
    }

    case "LAYER_MERGE": {
      const { frame, first, second } = action;
      return mergeLayerPixels(frame, first, second, state);
    }

    case "PIXELS_ADD":
    case "PIXELS_PASTE": {
      const { frame, layer, pixels } = action,
        px = sprout.get(state, [frame, layer], {}),
        newPx = _.merge(px, pixels);
      return sprout.assoc(state, [frame, layer], newPx);
    }

    case "PIXELS_CUT":
    case "PIXELS_DELETE": {
      const { frame, layer, pixels } = action;
      return deletePixels(state, frame, layer, pixels);
    }

    case "PIXELS_FLIP_HORIZONTAL": {
      const { frame, layer, pixels, pivot, size } = action;
      const bounds = createBounds(size);
      const newPixels = manipulatePixels(
        pixels,
        flipPixelHorizontal.bind(this, pivot, bounds)
      );

      state = deletePixels(state, frame, layer, pixels);
      return sprout.assoc(state, [frame, layer], newPixels);
    }

    case "PIXELS_FLIP_VERTICAL": {
      const { frame, layer, pixels, pivot, size } = action;
      const bounds = createBounds(size);
      const newPixels = manipulatePixels(
        pixels,
        flipPixelVertical.bind(this, pivot, bounds)
      );

      state = deletePixels(state, frame, layer, pixels);
      return sprout.assoc(state, [frame, layer], newPixels);
    }

    case "PIXELS_MOVE": {
      const { frame, layer, pixels, distance, size } = action;
      const bounds = createBounds(size);
      const newPixels = manipulatePixels(
        pixels,
        movePixel.bind(this, distance, bounds)
      );

      state = deletePixels(state, frame, layer, pixels);
      return sprout.assoc(state, [frame, layer], newPixels);
    }

    case "PIXELS_ROTATE": {
      const { frame, layer, pixels, angle, pivot, size } = action;
      const bounds = createBounds(size);
      const newPixels = manipulatePixels(
        pixels,
        rotatePixel.bind(this, angle, pivot, bounds)
      );

      state = deletePixels(state, frame, layer, pixels);
      return sprout.assoc(state, [frame, layer], newPixels);
    }

    case "COLOR_REPLACE": {
      const {
        frame,
        layer,
        selection,
        size,
        pixels,
        color,
        newColor,
        scope,
      } = action;

      let newPixels;

      switch (scope) {
        case "spritesheet":
          newPixels = manipulateSpritePixels(
            pixels,
            replaceColor.bind(this, color, newColor, null)
          );

          return newPixels;

        case "frame":
          newPixels = manipulateFramePixels(
            pixels,
            replaceColor.bind(this, color, newColor, null)
          );

          state = sprout.dissoc(state, [frame]);
          return sprout.assoc(state, [frame], newPixels);

        case "layer":
          const bounds = createBounds(size, selection);
          newPixels = manipulatePixels(
            pixels,
            replaceColor.bind(this, color, newColor, bounds)
          );

          state = deletePixels(state, frame, layer, pixels);
          return sprout.assoc(state, [frame, layer], newPixels);
      }
    }

    default:
      return state;
  }
}

export default filePixelsReducer;

// helper functions

function movePixel(distance, bounds, pixel) {
  pixel.translate(distance);
  if (insideBounds(bounds, pixel)) return pixel;
  else return false;
}

function rotatePixel(angle, pivot, bounds, pixel) {
  pixel.rotate(angle, pivot);
  if (insideBounds(bounds, pixel)) return pixel;
  else return false;
}

function flipPixelVertical(pivot, bounds, pixel) {
  pixel.flipVertical(pivot);
  if (insideBounds(bounds, pixel)) return pixel;
  else return false;
}

function flipPixelHorizontal(pivot, bounds, pixel) {
  pixel.flipHorizontal(pivot);
  if (insideBounds(bounds, pixel)) return pixel;
  else return false;
}

function copyPixelToFrame(frame, layerMap, pixel) {
  pixel.frame = frame;
  pixel.layer = layerMap[pixel.layer];
  return pixel;
}

const replaceColor = (color, newColor, bounds, pixel) => {
  if (bounds && !insideBounds(bounds, pixel)) return pixel;
  if (pixel.toHex() === color) {
    pixel.setColor(newColor);
  }
  return pixel;
};

function inflatePixels(pixels) {
  let pixelMap = {};
  pixels.forEach(pixel => {
    if (!pixelMap[pixel.x]) pixelMap[pixel.x] = {};
    pixelMap[pixel.x][pixel.y] = pixel;
  });
  return pixelMap;
}

function inflateFramePixels(pixels) {
  let pixelMap = {};
  pixels.forEach(pixel => {
    if (!pixelMap[pixel.layer]) pixelMap[pixel.layer] = {};
    if (!pixelMap[pixel.layer][pixel.x]) pixelMap[pixel.layer][pixel.x] = {};
    pixelMap[pixel.layer][pixel.x][pixel.y] = pixel;
  });
  return pixelMap;
}

function inflateSpritePixels(pixels) {
  let pixelMap = {};
  pixels.forEach(pixel => {
    if (!pixelMap[pixel.frame]) pixelMap[pixel.frame] = {};
    if (!pixelMap[pixel.frame][pixel.layer])
      pixelMap[pixel.frame][pixel.layer] = {};
    if (!pixelMap[pixel.frame][pixel.layer][pixel.x])
      pixelMap[pixel.frame][pixel.layer][pixel.x] = {};
    pixelMap[pixel.frame][pixel.layer][pixel.x][pixel.y] = pixel;
  });
  return pixelMap;
}

function manipulatePixels(pixels, callback) {
  pixels = flattenPixels(pixels);
  pixels.forEach(callback, this);
  pixels = inflatePixels(pixels);
  return pixels;
}

function manipulateFramePixels(pixels, callback) {
  pixels = flattenPixels(pixels);
  pixels.forEach(callback, this);
  pixels = inflateFramePixels(pixels);
  return pixels;
}

function manipulateSpritePixels(pixels, callback) {
  pixels = flattenPixels(pixels);
  pixels.forEach(callback, this);
  pixels = inflateSpritePixels(pixels);
  return pixels;
}
