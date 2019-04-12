import EyedropperTool from "components/paint/tools/EyedropperTool";

describe("EyedropperTool", () => {
  it("should render correctly", () => {
    const component = render(<EyedropperTool />);
    expect(component).toMatchSnapshot();
  });
});
