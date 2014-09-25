// compile LESS sources
module.exports = {
  browser: {
    files: {
      // target.css file: source.less file
      "build/browser/<%= package.name %>.css": "src/less/browser.less"
    }
  },
}