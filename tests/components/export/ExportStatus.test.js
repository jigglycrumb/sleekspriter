import ExportStatus from "components/export/ExportStatus";

describe("ExportStatus", () => {
  let props, jsx, wrapper;
  beforeEach(() => {
    props = {
      status: "Export finished",
      setStatus: jest.fn(),
    };
    jsx = <ExportStatus {...props} />;
    wrapper = shallow(jsx);
  });

  it("should render correctly", () => {
    expect(render(jsx)).toMatchSnapshot();
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
