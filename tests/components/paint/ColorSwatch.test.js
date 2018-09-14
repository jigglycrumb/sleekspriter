import ColorSwatch from "components/paint/ColorSwatch";

describe("ColorSwatch", () => {
  const props = {
    color: "#ff0000",
    action: jest.fn(),
  };

  it("should render correctly", () => {
    const wrapper = shallow(<ColorSwatch {...props} />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should render with a background color", () => {
    const wrapper = shallow(<ColorSwatch {...props} />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should call an action handler with its color on click", () => {
    const wrapper = shallow(<ColorSwatch {...props} />);
    wrapper.find(".colorswatch").simulate("click");
    expect(props.action).toBeCalledWith(props.color);
  });
});
