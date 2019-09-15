const ENV = "dev";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const metadata = require("./metadata.json");
const rules = require("./webpack.rules.common");

console.log('----------------------- rules ----------------------------', rules);

const config = {
  mode: "development",
  devtool: "source-map",
  context: path.resolve(__dirname, "."),
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "[name].[hash].js",
    globalObject: "typeof self !== 'undefined' ? self : this", // fix for "window not defined" in workers
  },
  resolve: {
    extensions: [".less", ".css", ".worker.js", ".js", ".json", ".jsx"],
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
