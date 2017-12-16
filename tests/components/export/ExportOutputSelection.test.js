import ExportOutputSelection from "components/export/ExportOutputSelection";

describe("ExportOutputSelection", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      format: "png",
      part: "spritesheet",
      setFormat: jest.fn()
    };

    wrapper = shallow(<ExportOutputSelection {...props} />);
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("select field", () => {
    it("has gif as option when an animation is exported", () => {
      props.part = "animation";
      wrapper = shallow(<ExportOutputSelection {...props} />);
      expect(wrapper.find("option[value=\"gif\"]").length).toEqual(1);
    });

    it("does not have gif as option when no animation is exported", () => {
      expect(wrapper.find("option[value=\"gif\"]").length).toEqual(0);
    });

    it("fires setFormat handler on change", () => {
      wrapper.find("select").simulate("change", { target: { value: "jpg" } });
      expect(props.setFormat).toHaveBeenCalledWith("jpg");
    });
  });
});
