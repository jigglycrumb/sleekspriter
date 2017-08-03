import capitalizeFirstLetter from "utils/capitalizeFirstLetter";

it("should capitalize the first letter of a string", () => {
  expect(capitalizeFirstLetter("hello")).toBe("Hello");
});
