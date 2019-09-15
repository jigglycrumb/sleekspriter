const path = require("path");

const base = path.resolve(path.join(__dirname, ".."));
const src = path.resolve(base, "src");
const workers = path.resolve(base, "src/workers");

module.exports = {
  base,
  path,
  src,
  workers,
};
