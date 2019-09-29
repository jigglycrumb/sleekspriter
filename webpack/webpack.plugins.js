const webpack = require("webpack");

const pkg = require("../package.json");

const getPlugins = platform => {
  return [
    new webpack.DefinePlugin({
      APPNAME: JSON.stringify(pkg.productName),
      AUTHOR: JSON.stringify(pkg.author),
      PLATFORM: JSON.stringify(platform),
      VERSION: JSON.stringify(pkg.version),
    }),
  ];
};

module.exports = getPlugins;
