import { t } from "utils";

jest.mock("i18n/en.yml", () => ({
  Hello: "Hello Sir!"
}));

it("should return an english text from the translation map", () => {
  expect(t("Hello")).toBe("Hello Sir!");
});
