import state from "../../__mocks__/state";
import { getTotalFrames } from "state/selectors";

describe("getTotalFrames", () => {
  it("returns the number of frames in the spritesheet", () => {
    const totalFrames = 6;
    expect(getTotalFrames(state)).toEqual(totalFrames);
  });
});
