import ColorSwatch from "components/paint/ColorSwatch";

describe("ColorSwatch", () => {
  it("should render correctly", () => {
    const wrapper = shallow(<ColorSwatch />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should render with a background color", () => {
    const wrapper = shallow(<ColorSwatch color="#ff0000" />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should call an action handler with its color on click", () => {
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <ColorSwatch color="#ff0000" action={clickHandler} />
    );
    wrapper.find(".colorswatch").simulate("click");
    expect(clickHandler).toBeCalledWith("#ff0000");
  });
});
