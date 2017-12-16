import React from "react";
import { FrameCanvas } from "components/canvases/FrameCanvas";

describe("FrameCanvas", () => {
  let props, wrapper, component, paint;

  beforeEach(() => {
    props = {
      frame: 1,
      layers: [],
      size: { width: 64, height: 64 },
      zoom: 10,
      clear: jest.fn()
    };

    paint = jest.fn();

    wrapper = shallow(<FrameCanvas {...props} />, {
      disableLifecycleMethods: true
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
});
