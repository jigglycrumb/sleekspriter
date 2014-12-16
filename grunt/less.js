// compile LESS sources
module.exports = {
  browser: {
    files: {
      // target.css file: source.less file
      "build/browser/<%= package.name %>.css": "src/common/less/index.less"
    }
  },
  desktopMac: {
    files: {
      // target.css file: source.less file
      "build/desktop/mac/<%= package.name %>.css": "src/common/less/index.less"
    }
  },
}