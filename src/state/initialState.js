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
      height: 64,
      width: 64,
    },
  },
  ui: {
    app: {
      tab: "paint",
      modal: {
        visible: false,
        dialog: null,
      },
    },
    paint: {
      brightnessTool: {
        mode: "darken",
        intensity: 10,
      },
      color: "#000000",
      fold: {
        preview: false,
        frames: false,
        layers: false,
      },
      frame: 1, // null, // this causes React warnings
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
      palette: 11,
      tool: "BrushTool",
      zoom: 7,
    },
  },
};

export default state;
