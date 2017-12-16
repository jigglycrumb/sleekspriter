import LayerboxDrophelper from "components/paint/LayerboxDrophelper";

describe("LayerboxDrophelper", () => {
  it("should render correctly", () => {
    const component = shallow(<LayerboxDrophelper />);
    expect(component.html()).toMatchSnapshot();
  });
});
