const state = {
  file: {
    frames: {
      x: 3,
      y: 2
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
    pixels: {},
    size: {
      height: 32,
      width: 32
    }
  },
  ui: {
    app: {
      screen: "export",
      modal: {
        visible: false,
        dialog: null
      }
    },
    paint: {
      brightnessTool: {
        mode: "darken",
        intensity: 10
      },
      color: "#000000",
      clipboard: {},
      fold: {
        preview: false,
        frames: false,
        layers: false
      },
      frame: 1, // null, // this causes React warnings
      grid: true,
      layer: null,
      onion: {
        active: false,
        frame: {
          fixed: 1,
          relative: 1
        },
        mode: "fixed" // fixed or relative
      },
      palette: 0,
      selection: {
        start: null,
        end: null
      },
      spritePalette: [],
      tool: "BrushTool",
      zoom: 10
    },
    export: {
      part: "spritesheet",
      frame: 1,
      animation: null,
      zoom: 1,
      format: "png",
      status: ""
    }
  }
};

export default state;
