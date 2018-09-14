import state from "../../__mocks__/state";
import { getPaintLayer } from "state/selectors";

describe("getPaintLayer", () => {
  it("returns an object of the currently selected  layer", () => {
    const paintLayer = {
      id: 3,
      frame: 1,
      name: "Layer 3",
      z: 2,
      opacity: 100,
      visible: true,
    };
    expect(getPaintLayer(state)).toEqual(paintLayer);
  });
});
