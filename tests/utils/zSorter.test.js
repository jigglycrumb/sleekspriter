import { zSorter } from "utils";

jest.unmock("utils");

describe("zSorter", () => {
  let arr;
  beforeEach(() => {
    arr = [{ z: 2 }, { z: 4 }, { z: 1 }, { z: 0 }, { z: 5 }, { z: 3 }];
  });

  it("should sort an array of objects by their z value in descending order", () => {
    expect(arr.sort(zSorter)).toMatchSnapshot();
  });
});
