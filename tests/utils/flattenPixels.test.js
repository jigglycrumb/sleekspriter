import { flattenPixels } from "utils";
import pixels from "../__mocks__/layerPixelMock";

it("creates an array of pixels from a layer JSON map", () => {
  expect(flattenPixels(pixels)).toMatchSnapshot();
});
