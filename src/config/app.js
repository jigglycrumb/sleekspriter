const config = {
  defaultFolder: "~",
  defaultName: "unnamed",
  fileEncryptionSecret:
    "61d1a52a671076b2f4894be9472cf46e202fa36cd95bd86bacc4e0be7c87a6e2",
  fileExtension: "pixels",
  offset: {
    top: PLATFORM === "electron" ? 40 : 70,
    right: 228,
    bottom: 27,
    left: 45,
  },
  zoom: {
    min: 1,
    max: 50,
  },
  limits: {
    file: {
      size: {
        height: 64,
        width: 64,
      },
      frames: {
        x: 8,
        y: 8,
      },
    },
  },
};

export default config;
