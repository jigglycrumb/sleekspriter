import state from "../../__mocks__/state";
import { getPaintLayer } from "state/selectors";

describe("getPaintLayer", () => {
  it("returns an object of the currently selected  layer", () => {
    expect(getPaintLayer(state)).toMatchSnapshot();
  });
});
