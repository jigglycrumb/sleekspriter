jest.unmock("utils");

import { getPixelsInFrame } from "utils";

describe("getPixelsInFrame", () => {
  it("returns the pixels of a given frame", () => {
    const pixels = {
      1: {
        1: {
          1: {
            1: { frame: 1, layer: 1, x: 1, y: 1, r: 0, g: 0, b: 0, a: 1 },
            2: { frame: 1, layer: 1, x: 1, y: 2, r: 0, g: 0, b: 0, a: 1 }
          },
          2: {
            1: { frame: 1, layer: 1, x: 2, y: 1, r: 0, g: 0, b: 0, a: 1 },
            2: { frame: 1, layer: 1, x: 2, y: 2, r: 0, g: 0, b: 0, a: 1 }
          }
        },
        2: {
          1: {
            1: { frame: 1, layer: 2, x: 1, y: 1, r: 0, g: 0, b: 0, a: 1 },
            2: { frame: 1, layer: 2, x: 1, y: 2, r: 0, g: 0, b: 0, a: 1 }
          },
          2: {
            1: { frame: 1, layer: 2, x: 2, y: 1, r: 0, g: 0, b: 0, a: 1 },
            2: { frame: 1, layer: 2, x: 2, y: 2, r: 0, g: 0, b: 0, a: 1 }
          }
        }
      },
      2: {
        3: {
          1: {
            1: { frame: 2, layer: 3, x: 1, y: 1, r: 0, g: 0, b: 0, a: 1 },
            2: { frame: 2, layer: 3, x: 1, y: 2, r: 0, g: 0, b: 0, a: 1 }
          },
          2: {
            1: { frame: 2, layer: 3, x: 2, y: 1, r: 0, g: 0, b: 0, a: 1 },
            2: { frame: 2, layer: 3, x: 2, y: 2, r: 0, g: 0, b: 0, a: 1 }
          }
        },
        4: {
          1: {
            1: { frame: 2, layer: 4, x: 1, y: 1, r: 0, g: 0, b: 0, a: 1 },
            2: { frame: 2, layer: 4, x: 1, y: 2, r: 0, g: 0, b: 0, a: 1 }
          },
          2: {
            1: { frame: 2, layer: 4, x: 2, y: 1, r: 0, g: 0, b: 0, a: 1 },
            2: { frame: 2, layer: 4, x: 2, y: 2, r: 0, g: 0, b: 0, a: 1 }
          }
        }
      }
    };

    expect(getPixelsInFrame(1, pixels)).toMatchSnapshot();
  });
});
