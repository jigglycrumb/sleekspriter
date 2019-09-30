import React from "react";
import pkg from "../../package.json";

jest.mock("utils", () => ({
  t: text => text,
}));

global.React = React;
global.APPNAME = pkg.productName;
global.AUTHOR = pkg.author;
global.PLATFORM = "browser";
global.VERSION = pkg.version;
