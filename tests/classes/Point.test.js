import { Point } from "classes";

describe("Point", () => {
  let point, distance, pivot;
  beforeEach(() => {
    point = new Point(2, 3);
    distance = new Point(3, 3);
    pivot = new Point(5, 5);
  });

  it("is a Point with x and y coordinates", () => {
    expect(point.x).toBe(2);
    expect(point.y).toBe(3);
  });

  it("translates its coordinates by a given distance", () => {
    point.translate(distance);
    expect(point.x).toBe(5);
    expect(point.y).toBe(6);
  });

  it("returns a new point translated by a given distance without changing itself", () => {
    const translatedPoint = point.translate(distance, true);
    expect(point.x).toBe(2);
    expect(point.y).toBe(3);
    expect(translatedPoint.x).toBe(5);
    expect(translatedPoint.y).toBe(6);
  });

  it("rotates its coordinates 90° around a pivot point", () => {
    const angle = 90;
    point.rotate(angle, pivot);
    expect(point.x).toBe(7);
    expect(point.y).toBe(2);
  });

  it("rotates its coordinates 180° around a pivot point", () => {
    const angle = 180;
    point.rotate(angle, pivot);
    expect(point.x).toBe(8);
    expect(point.y).toBe(7);
  });
});
