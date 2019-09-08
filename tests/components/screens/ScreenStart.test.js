import ScreenStart from "components/screens/ScreenStart";

describe("ScreenStart", () => {
  let props, jsx, wrapper;
  beforeEach(() => {
    props = {
      modalShow: jest.fn(),
    };

    jsx = <ScreenStart {...props} />;

    wrapper = shallow(jsx);
  });

  it("should render correctly", () => {
    expect(render(jsx)).toMatchSnapshot();
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
