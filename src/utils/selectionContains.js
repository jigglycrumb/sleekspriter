import selectionIsActive from "./selectionIsActive";

function selectionContains(selection, point) {
  if(selectionIsActive(selection)) {
    return point.x >= selection.start.x &&
           point.x <= selection.end.x &&
           point.y >= selection.start.y &&
           point.y <= selection.end.y;
  }
  else return false;
}

export default selectionContains;
