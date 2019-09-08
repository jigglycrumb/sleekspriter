import { Pixel } from "classes";

describe("Pixel", () => {
  it("has a frame, layer, x and y coordinates, rgb and alpha values", () => {
    const pixel = new Pixel(23, 42, 2, 3, 255, 200, 128, 1); // frame, layer, x, y, r, g, b, a
    expect(pixel.frame).toBe(23);
    expect(pixel.layer).toBe(42);
    expect(pixel.x).toBe(2);
    expect(pixel.y).toBe(3);
    expect(pixel.r).toBe(255);
    expect(pixel.g).toBe(200);
    expect(pixel.b).toBe(128);
    expect(pixel.a).toBe(1);
  });

  describe("toHex", () => {
    it("returns the color as the CSS hex string", () => {
      let pixel;

      pixel = new Pixel(23, 42, 2, 3, 255, 0, 0, 1);
      expect(pixel.toHex()).toBe("#FF0000");

      pixel = new Pixel(23, 42, 2, 3, 0, 255, 0, 1);
      expect(pixel.toHex()).toBe("#00FF00");

      pixel = new Pixel(23, 42, 2, 3, 0, 0, 255, 1);
      expect(pixel.toHex()).toBe("#0000FF");

      pixel = new Pixel(23, 42, 2, 3, 0, 0, 0, 1);
      expect(pixel.toHex()).toBe("#000000");

      pixel = new Pixel(23, 42, 2, 3, 255, 255, 255, 1);
      expect(pixel.toHex()).toBe("#FFFFFF");
    });
  });

  describe("setColor", () => {
    it("updates the color from a given hex string", () => {
      const newColor = "#6666FF";

      const pixel = new Pixel(23, 42, 2, 3, 0, 0, 0, 1);
      pixel.setColor(newColor);
      expect(pixel.toHex()).toBe(newColor);
    });
  });
});
