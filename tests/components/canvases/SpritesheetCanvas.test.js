import { SpritesheetCanvas } from "components/canvases/SpritesheetCanvas";

describe("SpritesheetCanvas", () => {
  let props, wrapper, component, paint;
  beforeEach(() => {
    props = {
      clear: jest.fn(),
      fitToSize: jest.fn(),
      frames: { x: 2, y: 2 },
      layers: [],
      paintSinglePixel: jest.fn(),
      size: { width: 16, height: 16 },
      zoom: 10,
    };

    paint = jest.fn();

    wrapper = shallow(<SpritesheetCanvas {...props} />, {
      disableLifecycleMethods: true,
    });

    component = wrapper.instance();
    component.paint = paint;
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should paint itself after mounting", () => {
    component.componentDidMount();
    expect(paint).toHaveBeenCalledTimes(1);
  });

  it("should paint itself after updating", () => {
    component.componentDidUpdate();
    expect(paint).toHaveBeenCalledTimes(1);
  });

  describe("getPixelSpritesheetPosition", () => {
    it("calculates a pixels position in the spritesheet", () => {
      const pos = component.getPixelSpritesheetPosition({
        frame: 4,
        x: 3,
        y: 3,
      });

      expect(pos).toEqual({ x: 19, y: 19 });
    });
  });

  describe("getSpriteSheetSize", () => {
    it("calculates the total spritesheet size", () => {
      const size = component.getSpriteSheetSize(props.size, props.frames);
      expect(size).toEqual({ width: 32, height: 32 });
    });
  });
});
