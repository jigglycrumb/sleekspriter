import { duplicateLayers } from "utils";

it("duplicates given layers to a new frame", () => {
  const layers = [
    { id: 1, frame: 1, name: "Layer 1" },
    { id: 2, frame: 1, name: "Layer 2" },
  ];

  const targetFrame = 2;
  const nextLayerId = 3;

  expect(duplicateLayers(layers, targetFrame, nextLayerId)).toMatchSnapshot();
});
