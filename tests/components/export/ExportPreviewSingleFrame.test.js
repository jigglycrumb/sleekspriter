import ExportPreviewSingleFrame from "components/export/ExportPreviewSingleFrame";

describe("ExportPreviewSingleFrame", () => {
  let props, jsx, wrapper;
  beforeEach(() => {
    props = {
      format: "png",
      frame: 1,
      layers: [],
      size: { width: 16, height: 16 },
      pixels: {},
      zoom: 1,
    };
    jsx = <ExportPreviewSingleFrame {...props} />;
    wrapper = shallow(jsx);
  });

  it("should render correctly", () => {
    expect(render(jsx)).toMatchSnapshot();
  });

  describe("PNG preview", () => {
    it("does have a checkerboard background", () => {
      expect(wrapper.hasClass("checkerboard")).toEqual(true);
    });
  });

  describe("JPG preview", () => {
    it("does not have a checkerboard background", () => {
      props.format = "jpeg";
      wrapper = shallow(<ExportPreviewSingleFrame {...props} />);
      expect(wrapper.hasClass("checkerboard")).toEqual(false);
    });
  });

  describe("GIF preview", () => {
    it("does have a checkerboard background", () => {
      props.format = "gif";
      wrapper = shallow(<ExportPreviewSingleFrame {...props} />);
      expect(wrapper.hasClass("checkerboard")).toEqual(true);
    });
  });
});
