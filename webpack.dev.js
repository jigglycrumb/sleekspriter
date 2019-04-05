const ENV = "dev";
const baseConfig = require("./webpack.common.js");
const overrides = {
  mode: "development",
  devtool: "source-map",
};

const config = Object.assign({}, baseConfig, overrides);

console.info("----------------------------------------");
console.info(`Starting build for ENV ${ENV}`);
console.info("----------------------------------------");

console.log("");

console.info("--- Webpack config ---------------------");
console.info(config);
console.info("----------------------------------------");

module.exports = config;
