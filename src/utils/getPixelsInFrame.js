/**
 * Returns all pixels of one frame
 * @param {Number} frame Frame number
 * @param {Object} pixels All sprite pixels as map
 */
const getPixelsInFrame = (frame, pixels) => {
  if (pixels[frame]) return pixels[frame];
  else return {};
};

export default getPixelsInFrame;
