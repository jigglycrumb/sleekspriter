import Statusbar from "components/paint/Statusbar";

describe("Statusbar", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      grid: true,
      gridToggle: jest.fn(),
      frame: 1,
      pixelCount: 0,
      zoom: 10,
      undo: jest.fn(),
      canUndo: true,
      redo: jest.fn(),
      canRedo: false
    };
    wrapper = shallow(<Statusbar {...props} />);
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("fires gridToggle handler on grid button click", () => {
    wrapper.find("#toggleGrid").simulate("click");
    expect(props.gridToggle).toHaveBeenCalledTimes(1);
  });

  it("fires undo handler on undo button click", () => {
    wrapper.find("#historyUndo").simulate("click");
    expect(props.undo).toHaveBeenCalledTimes(1);
  });

  it("fires redo handler on redo button click", () => {
    wrapper.find("#historyRedo").simulate("click");
    expect(props.redo).toHaveBeenCalledTimes(1);
  });
});
