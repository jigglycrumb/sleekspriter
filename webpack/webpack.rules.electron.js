const { workers } = require("./webpack.paths");

module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: "node-loader",
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@marshallofsound/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  // Inline workers
  {
    test: /\.worker\.js$/,
    include: workers,
    use: [
      {
        loader: "worker-loader",
        options: {
          inline: true,
          fallback: false,
        },
      },
    ],
  },
];
