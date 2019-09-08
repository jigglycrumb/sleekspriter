const path = require("path");

module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: "node-loader"
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@marshallofsound/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules"
      }
    }
  },
  // own rules
  {
    test: /\.worker\.js$/,
    include: path.resolve(__dirname, "src/workers"),
    use: [
      {
        loader: "worker-loader",
        options: {
          name: "[hash].app-worker.js"
        }
      }
    ]
  },
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: "babel-loader"
  },

  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    use: ["file-loader"]
  },
  {
    test: /\.(woff|woff2)$/,
    use: [
      {
        loader: "url-loader",
        options: {
          prefix: "font",
          mimetype: "application/font-woff",
          limit: 10000
        }
      }
    ]
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: "url-loader",
        options: {
          mimetype: "application/octet-stream",
          limit: 10000
        }
      }
    ]
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: "url-loader",
        options: {
          mimetype: "image/svg+xml",
          limit: 10000
        }
      }
    ]
  },
  {
    test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: "url-loader",
        options: {
          mimetype: "image/png",
          limit: 10000
        }
      }
    ]
  },
  {
    test: /\.ya?ml$/,
    use: ["json-loader", "yaml-loader"]
  }
];
