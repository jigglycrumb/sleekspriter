// compile LESS sources
module.exports = {
  browser: {
    files: {
      // target.css file: source.less file
      "build/browser/<%= package.shortname %>.css": "src/common/less/index.less"
    }
  },
  desktopMac: {
    files: {
      // target.css file: source.less file
      "build/desktop/mac/<%= package.shortname %>.css": "src/common/less/index.less"
    }
  },
  desktopWindows: {
    files: {
      // target.css file: source.less file
      "build/desktop/windows/<%= package.shortname %>.css": "src/common/less/index.less"
    }
  },
  tablet: {
    files: {
      // target.css file: source.less file
      "build/tablet/<%= package.shortname %>.css": "src/common/less/index.less"
    }
  },
}