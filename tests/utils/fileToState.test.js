jest.unmock("utils");

import { fileToState } from "utils";

describe("fileToState", () => {
  it("maps JSON from file format to redux state", () => {
    const file = {
      size: [20, 20],
      frames: [7, 3],
      layers: [
        [4, 1, "lights", 2, 100, 1],
        [3, 1, "shadows", 1, 100, 1],
        [20, 20, "layer 20", 0, 100, 1],
        [19, 19, "layer 19", 0, 100, 1],
        [18, 18, "layer 18", 0, 100, 1],
        [17, 17, "layer 17", 0, 100, 1],
        [16, 16, "layer 16", 0, 100, 1],
        [15, 15, "layer 15", 0, 100, 1],
        [14, 13, "layer 14", 0, 100, 1],
        [12, 11, "layer 12", 0, 100, 1],
        [11, 10, "layer 11", 0, 100, 1],
        [10, 9, "layer 10", 0, 100, 1],
        [8, 6, "layer 8", 0, 100, 1],
        [7, 5, "layer 7", 0, 100, 1],
        [6, 4, "layer 6", 0, 100, 1],
        [5, 3, "layer 5", 0, 100, 1],
        [2, 2, "layer 2", 0, 100, 1],
        [1, 1, "shape", 0, 100, 1],
        [21, 8, "lights", 2, 100, 1],
        [22, 8, "shadows", 1, 100, 1],
        [23, 8, "shape", 0, 100, 1],
        [24, 7, "Layer 24", 0, 100, 1],
        [25, 14, "Layer 25", 0, 100, 1],
        [26, 21, "Layer 26", 0, 100, 1],
        [27, 12, "layer 11", 0, 100, 1]
      ],
      animations: [
        [2, "Animation 2", 10, [1, 7]],
        [1, "rotate", 10, [8, 9, 10, 11, 10, 9]]
      ],
      pixels: [
        [4, 13, 5, 254, 242, 128, 1],
        [4, 12, 5, 254, 242, 128, 1],
        [4, 11, 5, 254, 242, 128, 1]
      ]
    };

    expect(fileToState(file)).toMatchSnapshot();
  });
});
