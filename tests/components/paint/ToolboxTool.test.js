import ToolboxTool from "components/paint/ToolboxTool";

describe("ToolboxTool", () => {
  let props, jsx, wrapper;
  beforeEach(() => {
    props = {
      id: "BrushTool",
      icon: "flaticon-small23",
      selected: false,
      title: "Brush Tool (b)",
      toolSelect: jest.fn(),
    };
    jsx = <ToolboxTool {...props} />;
    wrapper = shallow(jsx);
  });

  it("should render correctly", () => {
    expect(render(jsx)).toMatchSnapshot();
  });

  it("should render correctly when selected", () => {
    props.selected = true;
    jsx = <ToolboxTool {...props} />;
    expect(render(jsx)).toMatchSnapshot();
  });

  it("is disabled when selected", () => {
    props.selected = true;
    wrapper = shallow(<ToolboxTool {...props} />);
    expect(wrapper.prop("disabled")).toEqual(true);
  });

  it("has the .active class when selected", () => {
    props.selected = true;
    wrapper = shallow(<ToolboxTool {...props} />);
    expect(wrapper.hasClass("active")).toEqual(true);
  });

  it("fires the toolSelect handler when clicked", () => {
    wrapper.simulate("click");
    expect(props.toolSelect).toBeCalledWith(props.id);
  });
});
