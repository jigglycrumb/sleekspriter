import state from "../../__mocks__/state";
import { getFrameLayers } from "state/selectors";

describe("getFrameLayers", () => {
  it("returns all layers of a given frame", () => {
    expect(getFrameLayers(state)).toMatchSnapshot();
  });
});
