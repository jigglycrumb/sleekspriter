const baseConfig = require("./webpack.common.js");
const overrides = {
  mode: "development",
};

const config = Object.assign({}, baseConfig, overrides);

console.info("--- Webpack config ---------------------");
console.info(config);
console.info("----------------------------------------");

module.exports = config;
