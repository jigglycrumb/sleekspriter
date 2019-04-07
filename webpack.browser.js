const ENV = "browser";

const path = require("path");
const baseConfig = require("./webpack.common.js");
const overrides = {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "build/browser"),
    filename: "bundle.js",
  },
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
