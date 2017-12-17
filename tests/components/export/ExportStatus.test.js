import ExportStatus from "components/export/ExportStatus";

describe("ExportStatus", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      status: "Export finished",
      setStatus: jest.fn()
    };
    wrapper = shallow(<ExportStatus {...props} />);
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("clearStatus", () => {
    it.skip("clears the timer state", () => {
      wrapper.setState({ timer: "some timer" }, () => {
        wrapper.instance().clearStatus(); // TODO: clearStatus uses async setState
        expect(wrapper.state("timer")).toEqual(null);
      });
    });

    it("calls setStatus handler with empty status", () => {
      wrapper.instance().clearStatus();
      expect(props.setStatus).toBeCalledWith("");
    });
  });
});
