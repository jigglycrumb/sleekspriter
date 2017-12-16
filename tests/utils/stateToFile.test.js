jest.unmock("utils");

import { stateToFile } from "utils";

describe("stateToFile", () => {
  it("maps JSON from redux state to file format", () => {
    const state = {
      frames: {
        x: 5,
        y: 3
      },
      layers: [
        { frame: 1, id: 2, name: "Layer 2", z: 1, opacity: 100, visible: true },
        { frame: 1, id: 1, name: "Layer 1", z: 0, opacity: 100, visible: true },
        { frame: 1, id: 3, name: "Layer 3", z: 2, opacity: 100, visible: true },
        { frame: 2, id: 4, name: "Layer 4", z: 0, opacity: 100, visible: true },
        { frame: 3, id: 5, name: "Layer 5", z: 0, opacity: 100, visible: true },
        { frame: 4, id: 6, name: "Layer 6", z: 0, opacity: 100, visible: true },
        { frame: 5, id: 7, name: "Layer 7", z: 0, opacity: 100, visible: true },
        { frame: 6, id: 8, name: "Layer 8", z: 0, opacity: 100, visible: true }
      ],
      pixels: {
        1: {
          1: {
            1: {
              1: { frame: 1, layer: 1, x: 1, y: 1, r: 0, g: 0, b: 0, a: 1 }
            }
          }
        }
      },
      size: {
        height: 32,
        width: 32
      }
    };

    expect(stateToFile(state)).toMatchSnapshot();
  });
});
