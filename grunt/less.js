// compile LESS sources
module.exports = {
  browser: {
    files: {
      // target.css file: source.less file
      "build/browser/<%= package.name %>.css": "src/browser/index.less"
    }
  },
  desktopMac: {
    files: {
      // target.css file: source.less file
      "build/desktop/mac/<%= package.name %>.css": "src/desktop/index.less"
    }
  },
  desktopWindows: {
    files: {
      // target.css file: source.less file
      "build/desktop/windows/<%= package.name %>.css": "src/desktop/index.less"
    }
  },
  tablet: {
    files: {
      // target.css file: source.less file
      "build/tablet/<%= package.name %>.css": "src/tablet/index.less"
    }
  },
};
