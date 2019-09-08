import state from "../../__mocks__/state";
import { getOnionFrameAbsolute } from "state/selectors";

describe("getOnionFrameAbsolute", () => {
  it("returns the absolute id of the onion frame with fixed onion mode", () => {
    state.ui.paint.onion.mode = "fixed";
    const onionFrame = 1;
    expect(getOnionFrameAbsolute(state)).toEqual(onionFrame);
  });

  it("returns the absolute id of the onion frame with relative onion mode", () => {
    state.ui.paint.onion.mode = "relative";
    const onionFrame = 2;
    expect(getOnionFrameAbsolute(state)).toEqual(onionFrame);
  });
});
