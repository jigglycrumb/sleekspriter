import App from "platform-specific/App";

// jest.mock("platform-specific/Menu", () => "Menu");

// jest.mock("../containers/MenuContainer", () => <div>Menu</div>);

describe("App", () => {
  const props = {
    screen: "paint",
    windowResize: jest.fn(),
  };

  it("should render correctly", () => {
    const wrapper = shallow(<App {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
