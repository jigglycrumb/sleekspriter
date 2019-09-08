import state from "../../__mocks__/state";
import { getNewLayerId } from "state/selectors";

describe("getNewLayerId", () => {
  it("returns the id for the next new layer", () => {
    const newLayerId = 9;
    expect(getNewLayerId(state)).toEqual(newLayerId);
  });
});
