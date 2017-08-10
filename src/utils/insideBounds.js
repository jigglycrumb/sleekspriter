function insideBounds(selection, point) {
  return point.x >= selection.start.x &&
         point.x <= selection.end.x &&
         point.y >= selection.start.y &&
         point.y <= selection.end.y;
}

export default insideBounds;
