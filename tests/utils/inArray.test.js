jest.unmock("utils");

import { inArray } from "utils";

describe("inArray", () => {
  let array;
  beforeEach(() => {
    array = ["apple", "banana", "lemon"];
  });

  it("should return true when a value is in the array", () => {
    expect(inArray(array, "banana")).toBe(true);
  });

  it("should return false when a value is not in the array", () => {
    expect(inArray(array, "beef")).toBe(false);
  });
});
