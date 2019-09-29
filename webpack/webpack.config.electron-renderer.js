const PLATFORM = "electron";

const extensions = require("./webpack.extensions");
const { path, src } = require("./webpack.paths");
const getPlugins = require("./webpack.plugins");
const commonRules = require("./rules/common");
const electronRules = require("./rules/electron");

const rules = electronRules.concat(commonRules);
const plugins = getPlugins(PLATFORM);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    alias: {
      "platform-specific": path.resolve(
        src,
        `components/platform-specific/${PLATFORM}`
      ),
    },
    extensions,
  },
  plugins,
};
