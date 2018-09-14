import state from "../../__mocks__/state";
import { getFrameLayersZSorted } from "state/selectors";

describe("getFrameLayersZSorted", () => {
  it("returns all layers of a given frame sorted by z value (descending)", () => {
    const frameLayers = [
      { id: 3, frame: 1, name: "Layer 3", z: 2, opacity: 100, visible: true },
      { id: 2, frame: 1, name: "Layer 2", z: 1, opacity: 100, visible: true },
      { id: 1, frame: 1, name: "Layer 1", z: 0, opacity: 100, visible: true },
    ];

    expect(getFrameLayersZSorted(state)).toEqual(frameLayers);
  });
});
