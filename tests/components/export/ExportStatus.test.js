import ExportStatus from "components/export/ExportStatus";

describe("ExportStatus", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      status: "Export finished",
      setStatus: jest.fn(),
    };
    wrapper = shallow(<ExportStatus {...props} />);
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("clearStatus", () => {
    it("clears the timer state", () => {
      wrapper.instance().timer = 1;
      wrapper.instance().clearStatus();
      expect(wrapper.instance().timer).toBe(undefined);
    });

    it("calls setStatus handler with empty status", () => {
      wrapper.instance().clearStatus();
      expect(props.setStatus).toBeCalledWith("");
    });
  });
});
