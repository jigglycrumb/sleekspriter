import { getPivot } from "utils";

jest.unmock("utils");

describe("getPivot", () => {
  let size;
  beforeEach(() => {
    size = {
      width: 32,
      height: 32,
    };
  });

  it("should return the center of the frame when no selection is active", () => {
    const selection = { start: null, end: null };
    const pivot = getPivot(size, selection);
    expect(pivot.x).toBe(16.5);
    expect(pivot.y).toBe(16.5);
  });

  it("should return the center of the selection when a selection is active", () => {
    const selection = { start: { x: 2, y: 2 }, end: { x: 8, y: 12 } };
    const pivot = getPivot(size, selection);
    expect(pivot.x).toBe(5.5);
    expect(pivot.y).toBe(7.5);
  });
});
