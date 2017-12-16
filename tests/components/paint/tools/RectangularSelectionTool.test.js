import React from "react";
import RectangularSelectionTool from "components/paint/tools/RectangularSelectionTool";

describe("RectangularSelectionTool", () => {
  it("should render correctly", () => {
    const component = shallow(<RectangularSelectionTool />);
    expect(component.html()).toMatchSnapshot();
  });
});
