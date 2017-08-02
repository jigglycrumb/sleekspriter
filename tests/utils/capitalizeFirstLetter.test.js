import capitalizeFirstLetter from "../../src/utils/capitalizeFirstLetter";

test("capitalizeFirstLetter", () => {
  it("should capitalize the first letter of a string", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
  });
});
