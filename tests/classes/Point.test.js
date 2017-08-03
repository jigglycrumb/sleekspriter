import Point from "classes/Point";

describe("Point", () => {
  let point, distance;
  beforeEach(() => {
    point = new Point(1, 2);
    distance = new Point(3, 3);
  });

  it("is a Point with x and y coordinates", () => {
    expect(point.x).toBe(1);
    expect(point.y).toBe(2);
  });

  it("translates its coordinates by a given distance", () => {
    point.translate(distance);
    expect(point.x).toBe(4);
    expect(point.y).toBe(5);
  });

  it("returns a new point translated by a given distance without changing itself", () => {
    const translatedPoint = point.translate(distance, true);
    expect(point.x).toBe(1);
    expect(point.y).toBe(2);
    expect(translatedPoint.x).toBe(4);
    expect(translatedPoint.y).toBe(5);
  });
});
