import ExportButton from "components/export/ExportButton";

describe("ExportButton", () => {
  let props, jsx, wrapper;
  beforeEach(() => {
    props = {
      export: jest.fn(),
    };
    jsx = <ExportButton {...props} />;
    wrapper = shallow(jsx);
  });

  it("should render correctly", () => {
    expect(render(jsx)).toMatchSnapshot();
  });

  it("fires export handler on click", () => {
    wrapper.simulate("click");
    expect(props.export).toHaveBeenCalledTimes(1);
  });
});
