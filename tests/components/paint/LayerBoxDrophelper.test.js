import LayerboxDrophelper from "components/paint/LayerboxDrophelper";

describe("LayerboxDrophelper", () => {
  it("should render correctly", () => {
    const component = render(<LayerboxDrophelper />);
    expect(component).toMatchSnapshot();
  });
});
