import { insideBounds } from "utils";

jest.unmock("utils");

jest.mock("utils/selectionIsActive", () => jest.fn(() => true));

describe("insideBounds", () => {
  it("should return true when point is inside bounds", () => {
    const point = { x: 3, y: 3 };

    const bounds = {
      start: { x: 1, y: 1 },
      end: { x: 5, y: 5 },
    };

    expect(insideBounds(bounds, point)).toBe(true);
  });

  it("should return false when point is outside bounds", () => {
    const point = { x: 42, y: 23 };

    const bounds = {
      start: { x: 1, y: 1 },
      end: { x: 5, y: 5 },
    };

    expect(insideBounds(bounds, point)).toBe(false);
  });
});
