const state = {
  cache: {
    layersByFrame: [],
  },
  file: {
    frames: {
      x: 0,
      y: 0
    },
    layers: [
      {frame: 1, id: 1, name: "Layer 1", z: 0, opacity: 100, visible: true},
      {frame: 1, id: 2, name: "Layer 2", z: 1, opacity: 100, visible: true},
      {frame: 1, id: 3, name: "Layer 3", z: 2, opacity: 100, visible: true},
    ],
    size: {
      height: 90,
      width: 160,
    },
  },
  ui: {
    paint: {
      brightnessTool: {
        mode: "darken",
        intensity: 10,
      },
      fold: {
        preview: false,
        frames: false,
        layers: false,
      },
      frame: null,
      grid: true,
      layer: null,
      tool: "EraserTool",
      zoom: 10,
    },
  },
};

export default state;
