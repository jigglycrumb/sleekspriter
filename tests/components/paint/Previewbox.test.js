import Previewbox from "components/paint/Previewbox";

describe("Previewbox", () => {
  let props, jsx;
  beforeEach(() => {
    props = {
      size: { width: 32, height: 32 },
      pixels: {},
      layers: [],
      frame: 1,
      registerPreviewCanvas: jest.fn(),
    };
    jsx = <Previewbox {...props} />;
  });

  it("should render correctly", () => {
    expect(render(jsx)).toMatchSnapshot();
  });
});
