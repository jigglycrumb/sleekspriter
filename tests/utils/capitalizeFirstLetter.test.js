import { capitalizeFirstLetter } from "utils";

jest.unmock("utils");

describe("capitalizeFirstLetter", () => {
  it("should capitalize the first letter of a string", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
  });
});
