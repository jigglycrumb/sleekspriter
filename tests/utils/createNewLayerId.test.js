import { createNewLayerId } from "utils";

jest.unmock("utils");

describe("createNewLayerId", () => {
  it("returns the next possible id from given layers", () => {
    const layers = [
      { id: 1, frame: 1, name: "Layer 1" },
      { id: 2, frame: 1, name: "Layer 2" },
      { id: 3, frame: 1, name: "Layer 3" },
      { id: 4, frame: 1, name: "Layer 4" },
    ];

    expect(createNewLayerId(layers)).toBe(5);
  });
});
