import initialState from "../initialState";
import { merge } from "lodash";
import { assoc, dissoc, get } from "sprout-data";
import {
  createBounds,
  deletePixels,
  duplicateLayers,
  flattenPixels,
  getPivot,
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
      const pixelsToDuplicate = get(state, [source], {});
      const newLayers = duplicateLayers(layers, target, nextLayerId);

      const layerMap = {};
      layers.map((layer, index) => {
        layerMap[layer.id] = newLayers[index].id;
      });

      const newPixels = manipulateFramePixels(
        pixelsToDuplicate,
        copyPixelToFrame.bind(this, target, layerMap)
      );
      state = dissoc(state, [target]);
      return assoc(state, [target], newPixels);
    }

    case "FRAME_FLIP_HORIZONTAL":
    case "FRAME_FLIP_VERTICAL":
    case "FRAME_ROTATE": {
      const { angle, frame, size, type } = action;
      const pixels = get(state, [frame], {});
      const pivot = getPivot(size);
      const bounds = createBounds(size);

      const handlers = {
        FRAME_FLIP_HORIZONTAL: {
          func: flipPixelHorizontal,
          args: [pivot, bounds],
        },
        FRAME_FLIP_VERTICAL: { func: flipPixelVertical, args: [pivot, bounds] },
        FRAME_ROTATE: { func: rotatePixel, args: [pivot, bounds, angle] },
      };

      const newPixels = manipulateFramePixels(
        pixels,
        handlers[type].func.bind(this, ...handlers[type].args),
        createBounds(size)
      );

      state = dissoc(state, [frame]);
      return assoc(state, [frame], newPixels);
    }

    case "LAYER_DELETE": {
      return dissoc(state, [action.frame, action.layer]);
    }

    case "LAYER_MERGE": {
      const { frame, first, second } = action;
      return mergeLayerPixels(frame, first, second, state);
    }

    case "PIXELS_ADD":
    case "PIXELS_PASTE": {
      const { frame, layer, pixels } = action;
      const px = get(state, [frame, layer], {});
      const newPixels = { ...merge(px, pixels) };
      return assoc(state, [frame, layer], newPixels);
    }

    case "PIXELS_CUT":
    case "PIXELS_DELETE": {
      const { frame, layer, pixels } = action;
      return deletePixels(state, frame, layer, pixels);
    }

    case "PIXELS_FLIP_HORIZONTAL":
    case "PIXELS_FLIP_VERTICAL":
    case "PIXELS_ROTATE": {
      const { angle, frame, layer, size, selection, type } = action;

      const pixels = get(state, [frame, layer], {});
      const pivot = getPivot(size, selection);
      const bounds = createBounds(size, selection);

      const handlers = {
        PIXELS_FLIP_HORIZONTAL: {
          func: flipPixelHorizontal,
          args: [pivot, bounds],
        },
        PIXELS_FLIP_VERTICAL: {
          func: flipPixelVertical,
          args: [pivot, bounds],
        },
        PIXELS_ROTATE: {
          func: rotatePixel,
          args: [pivot, bounds, angle],
        },
      };

      const newPixels = manipulatePixels(
        pixels,
        handlers[type].func.bind(this, ...handlers[type].args),
        createBounds(size)
      );

      state = dissoc(state, [frame, layer]);
      return assoc(state, [frame, layer], newPixels);
    }

    case "PIXELS_MOVE": {
      const { frame, layer, distance, selection, size } = action;
      const pixels = get(state, [frame, layer], {});
      const bounds = createBounds(size, selection);
      const newPixels = manipulatePixels(
        pixels,
        movePixel.bind(this, distance, bounds),
        createBounds(size)
      );

      state = deletePixels(state, frame, layer, pixels);
      return assoc(state, [frame, layer], newPixels);
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

          state = dissoc(state, [frame]);
          return assoc(state, [frame], newPixels);

        case "layer": {
          const bounds = createBounds(size, selection);
          newPixels = manipulatePixels(
            pixels,
            replaceColor.bind(this, color, newColor, bounds)
          );

          state = deletePixels(state, frame, layer, pixels);
          return assoc(state, [frame, layer], newPixels);
        }

        default:
          return state;
      }
    }

    default:
      return state;
  }
}

export default filePixelsReducer;

// helper functions

function movePixel(distance, bounds, pixel) {
  if (insideBounds(bounds, pixel)) return pixel.translate(distance);
  else return pixel;
}

function rotatePixel(pivot, bounds, angle, pixel) {
  if (insideBounds(bounds, pixel)) return pixel.rotate(angle, pivot);
  else return pixel;
}

function flipPixelVertical(pivot, bounds, pixel) {
  if (insideBounds(bounds, pixel)) return pixel.flipVertical(pivot);
  else return pixel;
}

function flipPixelHorizontal(pivot, bounds, pixel) {
  if (insideBounds(bounds, pixel)) return pixel.flipHorizontal(pivot);
  else return pixel;
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
  const pixelMap = {};
  pixels.forEach(pixel => {
    if (!pixelMap[pixel.x]) pixelMap[pixel.x] = {};
    pixelMap[pixel.x][pixel.y] = pixel;
  });
  return pixelMap;
}

function inflateFramePixels(pixels) {
  const pixelMap = {};
  pixels.forEach(pixel => {
    if (!pixelMap[pixel.layer]) pixelMap[pixel.layer] = {};
    if (!pixelMap[pixel.layer][pixel.x]) pixelMap[pixel.layer][pixel.x] = {};
    pixelMap[pixel.layer][pixel.x][pixel.y] = pixel;
  });
  return pixelMap;
}

function inflateSpritePixels(pixels) {
  const pixelMap = {};
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

function manipulatePixels(pixels, callback, size) {
  pixels = flattenPixels(pixels);
  pixels.forEach(callback);

  if (size) pixels = pixels.filter(pixel => insideBounds(size, pixel)); // delete out of stage pixels

  pixels = inflatePixels(pixels);
  return pixels;
}

function manipulateFramePixels(pixels, callback, size) {
  pixels = flattenPixels(pixels);
  pixels.forEach(callback);

  if (size) pixels = pixels.filter(pixel => insideBounds(size, pixel)); // delete out of stage pixels

  pixels = inflateFramePixels(pixels);
  return pixels;
}

function manipulateSpritePixels(pixels, callback, size) {
  pixels = flattenPixels(pixels);
  pixels.forEach(callback);

  if (size) pixels = pixels.filter(pixel => insideBounds(size, pixel)); // delete out of stage pixels

  pixels = inflateSpritePixels(pixels);
  return pixels;
}
