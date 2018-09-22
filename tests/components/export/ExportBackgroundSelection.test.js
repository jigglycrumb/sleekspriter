import ExportBackgroundSelection from "components/export/ExportBackgroundSelection";

describe("ExportBackgroundSelection", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      background: "#cccccc",
      setBackground: jest.fn(),
    };
    wrapper = shallow(<ExportBackgroundSelection {...props} />);
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
