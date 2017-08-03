import translate from "../../src/utils/translate";

jest.mock("../../src/i18n/en.yml", () => ({
  Hello: "Hello Sir!"
}));

it("should return an english text from the translation map", () => {
  expect(translate("Hello")).toBe("Hello Sir!");
});
