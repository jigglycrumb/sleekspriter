import { selectionContains } from "utils";

jest.mock("utils/selectionIsActive", () => jest.fn(() => true));

describe("selectionContains", () => {
  it("should return true when point is inside selection", () => {
    const point = { x: 3, y: 3 };

    const selection = {
      start: { x: 1, y: 1},
      end: { x: 5, y: 5}
    };

    expect(selectionContains(selection, point)).toBe(true);
  });

  it("should return false when point is outside selection", () => {
    const point = { x: 42, y: 23 };

    const selection = {
      start: { x: 1, y: 1},
      end: { x: 5, y: 5}
    };

    expect(selectionContains(selection, point)).toBe(false);
  });
});
