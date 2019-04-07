import { selectionIsActive } from "utils";

jest.unmock("utils");

describe("selectionIsActive", () => {
  it("should return true with a valid selection", () => {
    const selection = {
      start: { x: 1, y: 1 },
      end: { x: 5, y: 5 },
    };

    expect(selectionIsActive(selection)).toBe(true);
  });

  it("should return false with an empty selection", () => {
    const selection = {
      start: null,
      end: null,
    };

    expect(selectionIsActive(selection)).toBe(false);
  });
});
