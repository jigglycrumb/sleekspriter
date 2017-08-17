const deletePixels = (allPixels, frame, layer, pixelsToDelete) => {

  Object.keys(pixelsToDelete).map(x => {
    Object.keys(pixelsToDelete[x]).map(y => {
      // console.log("delete! ", frame, layer, x, y);
      delete allPixels[frame][layer][x][y];
    });

    if(Object.keys(allPixels[frame][layer][x]).length === 0) {
      // console.log("delete! ", frame, layer, x);
      delete allPixels[frame][layer][x];
    }
  });

  if(Object.keys(allPixels[frame][layer]).length === 0) {
    // console.log("delete! ", frame, layer);
    delete allPixels[frame][layer];
  }
  if(Object.keys(allPixels[frame]).length === 0) {
    // console.log("delete! ", frame);
    delete allPixels[frame];
  }

  return allPixels;
};

export default deletePixels;
