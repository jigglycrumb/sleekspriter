import React from "react";
import renderer from "react-test-renderer";

import ScreenStart from "../../../src/components/screens/ScreenStart";

test("ScreenStart renders correctly", () => {

  const props = {
    modalShow: () => "Showing new file modal window"
  };

  const component = renderer.create(
    <ScreenStart {...props} />
  );

  expect(component).toMatchSnapshot();
});
