// this function takes two points and returns a selection object where the
// start always is the top left corner and
// end is the bottom right one
// this makes drawing the selection easier and ensures width calculations etc are always consistent

const createSelection = (p1, p2) => {
  return {
    start: {
      x: p1.x < p2.x ? p1.x : p2.x,
      y: p1.y < p2.y ? p1.y : p2.y,
    },
    end: {
      x: p1.x > p2.x ? p1.x : p2.x,
      y: p1.y > p2.y ? p1.y : p2.y,
    },
  };
};

export default createSelection;
