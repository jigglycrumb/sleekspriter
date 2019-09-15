const ENV = "browser";

const HtmlWebpackPlugin = require("html-webpack-plugin");

const extensions = require("./webpack.extensions");
const { base, path, src } = require("./webpack.paths");
const rules = require("./webpack.rules.common");

const metadata = require("../metadata.json");

const config = {
  mode: "production",
  context: base,
  entry: {
    app: path.resolve(src, "index.js"),
  },
  output: {
    path: path.resolve(base, "build/browser"),
    filename: "bundle.js",
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
