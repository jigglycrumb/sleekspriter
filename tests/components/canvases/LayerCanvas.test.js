import { LayerCanvas } from "components/canvases/LayerCanvas";

describe("LayerCanvas", () => {
  let props, jsx, wrapper, component, paint;

  beforeEach(() => {
    props = {
      clear: jest.fn(),
      clearSinglePixel: jest.fn(),
      fitToSize: jest.fn(),
      layer: 1,
      paintSinglePixel: jest.fn(),
      size: { width: 64, height: 64 },
      zoom: 10,
    };

    jsx = <LayerCanvas {...props} />;

    wrapper = shallow(jsx, {
      disableLifecycleMethods: true,
    });

    component = wrapper.instance();

    paint = jest.fn();
    component.paint = paint;
  });

  it("should render correctly", () => {
    expect(render(jsx)).toMatchSnapshot();
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
