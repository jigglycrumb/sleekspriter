import Previewbox from "components/paint/Previewbox";

describe("Previewbox", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      size: { width: 32, height: 32 },
      pixels: {},
      layers: [],
      frame: 1,
      registerPreviewCanvas: jest.fn(),
    };
    wrapper = shallow(<Previewbox {...props} />);
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
