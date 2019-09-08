import StageboxLayer from "components/paint/StageboxLayer";

describe("StageboxLayer", () => {
  let props, jsx;
  beforeEach(() => {
    props = {
      layer: {
        id: 1,
        frame: 1,
        visible: true,
        opacity: 100,
        z: 1,
        name: "Layer 1",
      },
      size: {
        height: 32,
        width: 32,
      },
      zoom: 10,
    };
    jsx = <StageboxLayer {...props} />;
  });

  it("should render correctly", () => {
    expect(render(jsx)).toMatchSnapshot();
  });
});
