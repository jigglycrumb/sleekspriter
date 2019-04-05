const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const metadata = require("./metadata.json");

const replaceConfig = Object.keys(metadata).map(function(key) {
  return { search: key, replace: metadata[key], flags: "g" };
});

const config = {
  mode: "production",
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
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.worker\.js$/,
        include: path.resolve(__dirname, "src/workers"),
        use: [
          {
            loader: "worker-loader",
            options: {
              name: "[hash].app-worker.js",
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: ["file-loader"],
      },
      {
        test: /\.(woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              prefix: "font",
              mimetype: "application/font-woff",
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "application/octet-stream",
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/svg+xml",
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png",
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.ya?ml$/,
        use: ["json-loader", "yaml-loader"],
      },
      {
        test: /\.(html|js|yml)$/,
        use: [
          {
            loader: "string-replace-loader",
            query: { multiple: replaceConfig },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: "src/assets/logo@x1.png",
      template: "src/index.html",
    }),
  ],
  target: "web",
  devServer: {
    historyApiFallback: true,
  },
};

module.exports = config;
