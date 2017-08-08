import { Pixel } from "classes";

describe("Pixel", () => {
  it("is a Pixel with frame, layer, x and y coordinates, rgb and alpha values", () => {
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
});
