import {
  selectionContains,
  selectionIsActive
} from "../../utils";

const getPixelsInScope = (state) => {

  return state;

  console.log(state);

  const { frame, layer, selection } = state.ui.paint;
  const { pixels } = state.file;

  let pixelsInScope = {};
  if(pixels[frame] && pixels[frame][layer]) {
    pixelsInScope = Object.assign({}, pixels[frame][layer]);
  }

  console.log(pixelsInScope);

  if(selectionIsActive(selection)) {
    console.log("selection is active");

    const xValues = Object.keys(pixelsInScope);
    xValues.map(x => {
      const yValues = Object.keys(pixelsInScope[x]);
      yValues.map(y => {
        const p = pixelsInScope[x][y];
        if(p.x < selection.start.x || p.x > selection.end.x
        || p.y < selection.start.y || p.y > selection.end.y ) {
          delete pixelsInScope[x][y];
        }
      });

      if(Object.keys(pixelsInScope[x]).length === 0) delete pixelsInScope[x];
    });
    if(Object.keys(pixelsInScope).length === 0) pixelsInScope = {};
  }

  console.log(pixelsInScope);
  return pixelsInScope;
};

export default getPixelsInScope;
