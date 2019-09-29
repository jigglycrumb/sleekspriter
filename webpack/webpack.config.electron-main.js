const { src, path } = require("./webpack.paths");
const commonRules = require("./rules/common");
const electronRules = require("./rules/electron");

const rules = electronRules.concat(commonRules);

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: path.resolve(src, "main.js"),
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
