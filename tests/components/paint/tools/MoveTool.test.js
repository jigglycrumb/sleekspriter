import MoveTool from "components/paint/tools/MoveTool";

describe("MoveTool", () => {
  it("should render correctly", () => {
    const component = render(<MoveTool />);
    expect(component).toMatchSnapshot();
  });
});
