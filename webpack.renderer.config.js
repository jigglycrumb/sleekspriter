const path = require("path");
const rules = require("./webpack.rules");

rules.push({
  test: /\.(css|less)$/,
  include: path.resolve(__dirname, "src"),
  use: [
    {
      loader: "style-loader"
    },
    {
      loader: "css-loader",
      options: {
        sourceMap: true
      }
    },
    {
      loader: "less-loader",
      options: {
        sourceMap: true
      }
    }
  ]
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules
  },
  resolve: {
    extensions: [".less", ".css", ".worker.js", ".js", ".json", ".jsx"]
  }
};
