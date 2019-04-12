import { FrameCanvas } from "components/canvases/FrameCanvas";

describe("FrameCanvas", () => {
  let props, wrapper, component, paint;

  beforeEach(() => {
    props = {
      clear: jest.fn(),
      clearSinglePixel: jest.fn(),
      fitToSize: jest.fn(),
      frame: 1,
      layers: [],
      paintSinglePixel: jest.fn(),
      size: { width: 64, height: 64 },
      zoom: 10,
    };

    paint = jest.fn();

    wrapper = shallow(<FrameCanvas {...props} />, {
      disableLifecycleMethods: true,
    });

    component = wrapper.instance();
    component.paint = paint;
  });

  it("should render correctly", () => {
    expect(render(<FrameCanvas {...props} />)).toMatchSnapshot();
  });

  it("should paint itself after mounting", () => {
    component.componentDidMount();
    expect(paint).toHaveBeenCalledTimes(1);
  });

  it("should paint itself after updating", () => {
    component.componentDidUpdate();
    expect(paint).toHaveBeenCalledTimes(1);
  });
});
