const PLATFORM = "browser";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const extensions = require("./webpack.extensions");
const { base, src, path } = require("./webpack.paths");
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
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: "vendor",
  //         chunks: "initial",
  //       },
  //     },
  //   },
  // },
};

console.info("----------------------------------------");
console.info(`Starting build for platform ${PLATFORM}`);
console.info("----------------------------------------");
console.info("");
console.info("--- Webpack config ---------------------");
console.info(config);
console.info("----------------------------------------");

module.exports = config;
