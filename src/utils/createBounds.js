import { selectionIsActive } from "./";

const createBounds = (size, selection) => {
  if (!selection || !selectionIsActive(selection)) {
    return {
      start: { x: 1, y: 1 },
      end: { x: size.width, y: size.height },
    };
  } else {
    return selection;
  }
};

export default createBounds;
