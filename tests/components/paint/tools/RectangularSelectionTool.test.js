import RectangularSelectionTool from "components/paint/tools/RectangularSelectionTool";

describe("RectangularSelectionTool", () => {
  it("should render correctly", () => {
    const component = render(<RectangularSelectionTool />);
    expect(component).toMatchSnapshot();
  });
});
