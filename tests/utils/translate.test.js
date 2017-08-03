import translate from "utils/translate";

jest.mock("i18n/en.yml", () => ({
  Hello: "Hello Sir!"
}));

it("should return an english text from the translation map", () => {
  expect(translate("Hello")).toBe("Hello Sir!");
});
