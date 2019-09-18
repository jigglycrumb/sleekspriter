const ENV = "dev";

const HtmlWebpackPlugin = require("html-webpack-plugin");

const extensions = require("./webpack.extensions");
const { base, src, path } = require("./webpack.paths");
const commonRules = require("./webpack.rules.common");
const browserRules = require("./webpack.rules.browser");

const rules = browserRules.concat(commonRules);

const metadata = require("../metadata.json");

console.log(
  "----------------------- rules ----------------------------",
  rules
);

const config = {
  mode: "development",
  devtool: "source-map",
  context: base,
  entry: {
    app: path.resolve(src, "index.js"),
  },
  output: {
    filename: "[name].[hash].js",
    globalObject: "typeof self !== 'undefined' ? self : this", // fix for "window not defined" in workers
  },
  resolve: {
    extensions,
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: "src/assets/logo@x1.png",
      meta: {
        author: metadata.author,
      },
      template: "src/index.ejs",
      title: metadata.name,
    }),
  ],
  target: "web",
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules,
  },
};

console.info("----------------------------------------");
console.info(`Starting build for ENV ${ENV}`);
console.info("----------------------------------------");

console.log("");

console.info("--- Webpack config ---------------------");
console.info(config);
console.info("----------------------------------------");

module.exports = config;
