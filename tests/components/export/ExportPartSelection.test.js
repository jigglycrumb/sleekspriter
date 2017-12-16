import ExportPartSelection from "components/export/ExportPartSelection";

describe("ExportPartSelection", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      frame: 1,
      part: "spritesheet",
      totalFrames: 4,
      setPart: jest.fn(),
      setFrame: jest.fn()
    };
    wrapper = shallow(<ExportPartSelection {...props} />);
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("radio buttons", () => {
    it("fire setPart handler when clicked", () => {
      wrapper
        .find("input[value=\"frame\"]")
        .simulate("change", { target: { value: "frame" } });
      expect(props.setPart).toHaveBeenCalledWith("frame");
    });
  });

  describe("frame number input", () => {
    it("fires setFrame handler on change", () => {
      wrapper
        .find("input[type=\"number\"]")
        .simulate("change", { target: { value: 3 } });
      expect(props.setFrame).toHaveBeenCalledWith(3);
    });

    it("clamps the setFrame handler to a minimum of 1", () => {
      wrapper
        .find("input[type=\"number\"]")
        .simulate("change", { target: { value: -1 } });
      expect(props.setFrame).toHaveBeenCalledWith(1);
    });

    it("clamps the setFrame handler to a maximum of the total frames", () => {
      wrapper
        .find("input[type=\"number\"]")
        .simulate("change", { target: { value: 9001 } });
      expect(props.setFrame).toHaveBeenCalledWith(props.totalFrames);
    });
  });
});
