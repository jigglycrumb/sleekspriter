import React from "react";
import renderer from "react-test-renderer";

import ScreenStart from "../../../src/components/screens/ScreenStart";

// use this to mock imports in the tested component
// jest.mock('components/SampleComponent', () => 'SampleComponent');

test("ScreenStart renders correctly", () => {

  const props = {
    modalShow: () => "Showing new file modal window"
  };

  const component = renderer.create(
    <ScreenStart {...props} />
  );

  expect(component).toMatchSnapshot();
});
