jest.unmock("utils");

import pixels from "../__mocks__/layerPixelMock";
import { flattenPixels } from "utils";

describe("flattenPixels", () => {
  it("creates an array of pixels from a layer JSON map", () => {
    expect(flattenPixels(pixels)).toMatchSnapshot();
  });
});
