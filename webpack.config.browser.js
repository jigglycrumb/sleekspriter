const ENV = "browser";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const metadata = require("./metadata.json");
const rules = require("./webpack.rules.common");

const config = {
  mode: "production",
  context: path.resolve(__dirname, "."),
  entry: {
    app: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "build/browser"),
    filename: "bundle.js",
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
