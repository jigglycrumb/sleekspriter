import state from "../../__mocks__/state";
import { getOnionFrameLayersZSorted } from "state/selectors";

describe("getOnionFrameLayersZSorted", () => {
  it("returns all layers of a given frame sorted by z value (descending)", () => {
    // TODO for some reason the snapshot is wrong, I can't find the bug though
    // investigate... zSorter itself is fine, also in the tests
    expect(getOnionFrameLayersZSorted(state)).toMatchSnapshot();
  });
});
