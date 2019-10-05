const PLATFORM = "browser";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const extensions = require("./webpack.extensions");
const { base, path, src } = require("./webpack.paths");
const getPlugins = require("./webpack.plugins");
const commonRules = require("./rules/common");
const browserRules = require("./rules/browser");

const rules = browserRules.concat(commonRules);

const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    favicon: "src/assets/logo@x1.png",
    template: "src/assets/index.html",
  }),
  ...getPlugins(PLATFORM),
];

const config = {
  mode: "production",
  context: base,
  entry: {
    app: path.resolve(src, "index.js"),
  },
  output: {
    path: path.resolve(base, "out/browser"),
    filename: "bundle.js",
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
  target: "web",
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules,
  },
};

console.info("----------------------------------------");
console.info(`Starting build for platform ${PLATFORM}`);
console.info("----------------------------------------");
console.info("");
console.info("--- Webpack config ---------------------");
console.info(config);
console.info("----------------------------------------");

module.exports = config;
