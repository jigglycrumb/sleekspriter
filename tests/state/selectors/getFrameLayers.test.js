import state from "../../__mocks__/state";
import { getFrameLayers } from "state/selectors";

describe("getFrameLayers", () => {
  it("returns all layers of a given frame", () => {
    const frameLayers = [
      {
        id: 2,
        frame: 1,
        name: "Layer 2",
        z: 1,
        opacity: 100,
        visible: true,
      },
      {
        id: 1,
        frame: 1,
        name: "Layer 1",
        z: 0,
        opacity: 100,
        visible: true,
      },
      {
        id: 3,
        frame: 1,
        name: "Layer 3",
        z: 2,
        opacity: 100,
        visible: true,
      },
    ];

    expect(getFrameLayers(state)).toEqual(frameLayers);
  });
});
