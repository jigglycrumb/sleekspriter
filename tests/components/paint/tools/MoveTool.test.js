import React from "react";
import MoveTool from "components/paint/tools/MoveTool";

describe("MoveTool", () => {
  it("should render correctly", () => {
    const component = shallow(<MoveTool />);
    expect(component.html()).toMatchSnapshot();
  });
});
