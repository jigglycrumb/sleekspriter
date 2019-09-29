const { workers } = require("../webpack.paths");

module.exports = [
  {
    test: /\.worker\.js$/,
    include: workers,
    use: [
      {
        loader: "worker-loader",
      },
    ],
  },
];
