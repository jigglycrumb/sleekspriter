import EraserTool from "components/paint/tools/EraserTool";

describe("EraserTool", () => {
  it("should render correctly", () => {
    const component = render(<EraserTool />);
    expect(component).toMatchSnapshot();
  });
});
