import App from "components/common/App";

describe("App", () => {
  const props = {
    screen: "start",
    windowResize: jest.fn(),
  };

  it("should render correctly", () => {
    const wrapper = shallow(<App {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
