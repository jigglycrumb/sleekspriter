import ExportFormatSelection from "components/export/ExportFormatSelection";

describe("ExportFormatSelection", () => {
  let props, jsx, wrapper;
  beforeEach(() => {
    props = {
      format: "png",
      part: "spritesheet",
      setFormat: jest.fn(),
    };
    jsx = <ExportFormatSelection {...props} />;
    wrapper = shallow(jsx);
  });

  it("should render correctly", () => {
    expect(render(jsx)).toMatchSnapshot();
  });

  describe("select field", () => {
    it("has gif as option when an animation is exported", () => {
      props.part = "animation";
      wrapper = shallow(<ExportFormatSelection {...props} />);
      expect(wrapper.find('option[value="gif"]').length).toEqual(1);
    });

    it("does not have gif as option when no animation is exported", () => {
      expect(wrapper.find('option[value="gif"]').length).toEqual(0);
    });

    it("fires setFormat handler on change", () => {
      wrapper.find("select").simulate("change", { target: { value: "jpg" } });
      expect(props.setFormat).toHaveBeenCalledWith("jpg");
    });
  });
});
