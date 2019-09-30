import App from "components/common/App";

// jest.mock("platform-specific/Menu", () => "Menu");

// jest.mock("../containers/MenuContainer", () => <div>Menu</div>);

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
