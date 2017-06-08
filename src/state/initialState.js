const state = {
  cache: {
    layersByFrame: [],
  },
  file: {
    frames: {
      x: 3,
      y: 2
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
      frame: null, // this causes React warnings
      grid: true,
      layer: null,
      onion: {
        active: false,
        frame: {
          fixed: 1,
          relative: 1,
        },
        mode: "fixed", // fixed or relative
      },
      tool: "EraserTool",
      zoom: 10,
    },
  },
};

export default state;
