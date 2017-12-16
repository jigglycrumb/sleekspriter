import React from "react";
import ScreenStart from "components/screens/ScreenStart";

describe("ScreenStart", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      modalShow: jest.fn()
    };

    wrapper = shallow(<ScreenStart {...props} />);
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("newFile", () => {
    it("shows new file modal window", () => {
      wrapper
        .find("a")
        .at(0)
        .simulate("click");
      expect(props.modalShow).toBeCalledWith("ModalNewFile");
    });
  });

  describe("openFile", () => {
    it("shows load file modal window", () => {
      wrapper
        .find("a")
        .at(1)
        .simulate("click");
      expect(props.modalShow).toBeCalledWith("ModalLoadFile");
    });
  });
});
