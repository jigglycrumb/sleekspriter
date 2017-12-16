jest.unmock("utils");

import { createBounds } from "utils";

describe("createBounds", () => {
  let size;
  beforeEach(() => {
    size = {
      width: 32,
      height: 32
    };
  });

  it("should return the file bounds when no selection is active", () => {
    const selection = { start: null, end: null };
    expect(createBounds(size, selection)).toEqual({
      start: { x: 1, y: 1 },
      end: { x: size.width, y: size.height }
    });
  });

  it("should return the selection bounds a selection is active", () => {
    const selection = { start: { x: 2, y: 2 }, end: { x: 5, y: 6 } };
    expect(createBounds(size, selection)).toEqual({
      start: { x: 2, y: 2 },
      end: { x: 5, y: 6 }
    });
  });

  it("should return the file bounds when no selection is passed", () => {
    expect(createBounds(size)).toEqual({
      start: { x: 1, y: 1 },
      end: { x: size.width, y: size.height }
    });
  });
});
