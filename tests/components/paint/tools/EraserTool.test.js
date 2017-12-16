import EraserTool from "components/paint/tools/EraserTool";

describe("EraserTool", () => {
  it("should render correctly", () => {
    const component = shallow(<EraserTool />);
    expect(component.html()).toMatchSnapshot();
  });
});
