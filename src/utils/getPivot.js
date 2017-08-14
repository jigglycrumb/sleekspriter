import { selectionIsActive } from "./";

const getPivot = (size, selection) => {

  if(!selection) selection = { start: null, end: null };

  if(selectionIsActive(selection)) {
    return {
      x: (selection.start.x + selection.end.x + 1) / 2,
      y: (selection.start.y + selection.end.y + 1) / 2
    };
  }
  else {
    return {
      x: (size.width + 1) / 2,
      y: (size.height + 1) / 2
    };
  }
};

export default getPivot;
