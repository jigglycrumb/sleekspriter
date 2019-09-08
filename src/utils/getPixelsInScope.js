import _ from "lodash";

import { insideBounds, selectionIsActive } from "./";

/**
 *
 * @param {Number} frame Frame number
 * @param {Number} layer Layer ID
 * @param {Object} pixels All sprite pixels as map
 * @param {Object} selection The selection from redux store
 */
const getPixelsInScope = (frame, layer, pixels, selection) => {
  let pixelsInScope = {};

  if (pixels[frame] && pixels[frame][layer]) {
    pixelsInScope = _.cloneDeep(pixels[frame][layer]);
  }

  if (selectionIsActive(selection)) {
    const xValues = Object.keys(pixelsInScope);
    xValues.map(x => {
      const yValues = Object.keys(pixelsInScope[x]);
      yValues.map(y => {
        const p = pixelsInScope[x][y];

        if (!insideBounds(selection, p)) {
          delete pixelsInScope[x][y];
        }
      });

      if (Object.keys(pixelsInScope[x]).length === 0) delete pixelsInScope[x];
    });
    if (Object.keys(pixelsInScope).length === 0) pixelsInScope = {};
  }

  return pixelsInScope;
};

export default getPixelsInScope;
