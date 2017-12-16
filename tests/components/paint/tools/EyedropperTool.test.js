import React from "react";
import EyedropperTool from "components/paint/tools/EyedropperTool";

describe("EyedropperTool", () => {
  it("should render correctly", () => {
    const component = shallow(<EyedropperTool />);
    expect(component.html()).toMatchSnapshot();
  });
});
