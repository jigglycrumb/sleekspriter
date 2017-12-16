import React from "react";

jest.mock("utils", () => ({
  t: text => text
}));

global.React = React;

