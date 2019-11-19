function insideBounds(bounds, point) {
  return (
    point.x >= bounds.start.x &&
    point.x <= bounds.end.x &&
    point.y >= bounds.start.y &&
    point.y <= bounds.end.y
  );
}

export default insideBounds;
