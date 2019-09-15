const extensions = require("./webpack.extensions");
const commonRules = require("./webpack.rules.common");
const electronRules = require("./webpack.rules.electron");

const rules = electronRules.concat(commonRules);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions,
  },
};
