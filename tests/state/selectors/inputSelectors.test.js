import state from "../../__mocks__/state";
import { getFileFrames } from "state/selectors/inputSelectors";

describe("getFileFrames", () => {
  it("return all frames from the files' present state", () => {
    expect(getFileFrames(state)).toEqual({
      x: 3,
      y: 2
    });
  });
});
