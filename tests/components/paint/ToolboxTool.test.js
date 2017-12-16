import ToolboxTool from "components/paint/ToolboxTool";

describe("ToolboxTool", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      id: "BrushTool",
      icon: "flaticon-small23",
      selected: false,
      title: "Brush Tool (b)",
      toolSelect: jest.fn()
    };

    wrapper = shallow(<ToolboxTool {...props} />);
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should render correctly when selected", () => {
    props.selected = true;
    wrapper = shallow(<ToolboxTool {...props} />);
    expect(wrapper.html()).toMatchSnapshot();
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
