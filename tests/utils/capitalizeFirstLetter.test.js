import { capitalizeFirstLetter } from "utils";

it("should capitalize the first letter of a string", () => {
  expect(capitalizeFirstLetter("hello")).toBe("Hello");
});
