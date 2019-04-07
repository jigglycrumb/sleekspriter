import { Color } from "classes";

const asRgb = { rgb: [102, 102, 255] };
const asHex = { hex: "#6666FF" };

describe("Color", () => {
  describe("constructor", () => {
    it("accepts rgb values", () => {
      const color = new Color(asRgb);
      expect(color.r).toBe(102);
      expect(color.g).toBe(102);
      expect(color.b).toBe(255);
    });

    it("accepts a hex value", () => {
      const color = new Color(asHex);
      expect(color.r).toBe(102);
      expect(color.g).toBe(102);
      expect(color.b).toBe(255);
    });
  });

  describe("hex", () => {
    it("returns color as CSS hex string", () => {
      const color = new Color(asRgb);
      expect(color.hex()).toBe("#6666FF");
    });
  });

  describe("rgb", () => {
    it("returns object with r, g, b values", () => {
      const color = new Color(asHex);
      expect(color.rgb()).toEqual({ r: 102, g: 102, b: 255 });
    });
  });

  describe("rgbHuman", () => {
    it("returns r, g, b values as comma-separeted string", () => {
      const color = new Color(asHex);
      expect(color.rgbHuman()).toBe("102, 102, 255");
    });
  });

  describe("changeBrightness", () => {
    it("changes the brightness by value in %", () => {
      const color = new Color({ hex: "#000000" });
      color.changeBrightness(50);
      expect(color.hex()).toBe("#808080");
    });
  });
});
