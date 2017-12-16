import config from "config";
import ExportZoomSelection from "components/export/ExportZoomSelection";

describe("ExportZoomSelection", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      frames: {
        x: 2,
        y: 2
      },
      part: "frame",
      size: {
        x: 32,
        y: 32
      },
      zoom: 1,
      setZoom: jest.fn()
    };
    wrapper = shallow(<ExportZoomSelection {...props} />);
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("range input", () => {
    it("fires setZoom handler on change", () => {
      wrapper
        .find("input[type=\"range\"]")
        .simulate("change", { target: { value: 5 } });
      expect(props.setZoom).toHaveBeenCalledWith(5);
    });

    it("clamps the minimum zoom value to 1", () => {
      wrapper
        .find("input[type=\"range\"]")
        .simulate("change", { target: { value: -1 } });
      expect(props.setZoom).toHaveBeenCalledWith(1);
    });

    it(`clamps the maximum zoom value to ${
      config.zoom.max
    } (config.zoom.max)`, () => {
      wrapper
        .find("input[type=\"range\"]")
        .simulate("change", { target: { value: config.zoom.max + 10 } });
      expect(props.setZoom).toHaveBeenCalledWith(config.zoom.max);
    });
  });

  describe("number input", () => {
    it("fires setZoom handler on change", () => {
      wrapper
        .find("input[type=\"number\"]")
        .simulate("change", { target: { value: 5 } });
      expect(props.setZoom).toHaveBeenCalledWith(5);
    });

    it("clamps the minimum zoom value to 1", () => {
      wrapper
        .find("input[type=\"number\"]")
        .simulate("change", { target: { value: -1 } });
      expect(props.setZoom).toHaveBeenCalledWith(1);
    });

    it(`clamps the maximum zoom value to ${
      config.zoom.max
    } (config.zoom.max)`, () => {
      wrapper
        .find("input[type=\"number\"]")
        .simulate("change", { target: { value: config.zoom.max + 10 } });
      expect(props.setZoom).toHaveBeenCalledWith(config.zoom.max);
    });
  });
});
