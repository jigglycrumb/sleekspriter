import _ from "lodash";

import {
  selectionContains,
  selectionIsActive
} from "./";

const getPixelsInScope = (frame, layer, pixels, selection) => {

  let pixelsInScope = {};

  if(pixels[frame] && pixels[frame][layer]) {
    pixelsInScope = _.cloneDeep(pixels[frame][layer]);
  }

  // console.log(pixelsInScope);

  if(selectionIsActive(selection)) {
    console.log("selection is active");

    const xValues = Object.keys(pixelsInScope);
    xValues.map(x => {
      const yValues = Object.keys(pixelsInScope[x]);
      yValues.map(y => {
        const p = pixelsInScope[x][y];

        if(!selectionContains(selection, p)) {
          delete pixelsInScope[x][y];
        }
      });

      if(Object.keys(pixelsInScope[x]).length === 0) delete pixelsInScope[x];
    });
    if(Object.keys(pixelsInScope).length === 0) pixelsInScope = {};
  }

  // console.log(pixelsInScope);
  return pixelsInScope;
};

export default getPixelsInScope;
