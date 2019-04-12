import Colorswatch from "components/common/Colorswatch";

describe("Colorswatch", () => {
  const props = {
    color: "#ff0000",
    action: jest.fn(),
  };

  it("should render correctly", () => {
    const wrapper = render(<Colorswatch {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render with a background color", () => {
    const wrapper = render(<Colorswatch {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should call an action handler with its color on click", () => {
    const wrapper = shallow(<Colorswatch {...props} />);
    wrapper.find(".colorswatch").simulate("click");
    expect(props.action).toBeCalledWith(props.color);
  });
});
