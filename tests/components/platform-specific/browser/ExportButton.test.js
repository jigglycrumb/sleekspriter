import ExportButton from "platform-specific/ExportButton";

describe("ExportButton", () => {
  let props, jsx;
  beforeEach(() => {
    props = {
      file: {
        folder: false,
        name: false,
      },
      format: "png",
      exportStatus: jest.fn(),
    };
    jsx = <ExportButton {...props} />;
  });

  it("should render correctly", () => {
    expect(render(jsx)).toMatchSnapshot();
  });
});
