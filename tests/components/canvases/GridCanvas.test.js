import React from "react";
import { GridCanvas } from "components/canvases/GridCanvas";

describe("GridCanvas", () => {
  let props, wrapper, component, drawGrid;

  beforeEach(() => {
    props = {
      width: 128,
      height: 128,
      columns: 4,
      rows: 4,
      clear: jest.fn()
    };

    drawGrid = jest.fn();

    wrapper = shallow(<GridCanvas {...props} />, {
      disableLifecycleMethods: true
    });

    component = wrapper.instance();
    component.drawGrid = drawGrid;
  });

  it("should render correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should draw the grid after mounting", () => {
    component.componentDidMount();
    expect(drawGrid).toHaveBeenCalledTimes(1);
  });

  it("should draw the grid after updating", () => {
    component.componentDidUpdate();
    expect(drawGrid).toHaveBeenCalledTimes(1);
  });

  it("should clear the canvas after updating", () => {
    component.componentDidUpdate();
    expect(props.clear).toHaveBeenCalledTimes(1);
  });
});
