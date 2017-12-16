jest.unmock("utils");

import { capitalizeFirstLetter } from "utils";

describe("capitalizeFirstLetter", () => {
  it("should capitalize the first letter of a string", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
  });
});
