import ExportButton from "components/export/ExportButton";

describe("ExportButton", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      export: jest.fn(),
    };
    wrapper = shallow(<ExportButton {...props} />);
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("fires export handler on click", () => {
    wrapper.simulate("click");
    expect(props.export).toHaveBeenCalledTimes(1);
  });
});
