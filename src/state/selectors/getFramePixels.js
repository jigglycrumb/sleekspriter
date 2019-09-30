// returns an object containing the pixels of selected painting frame
import { getPaintFrame, getFilePixels } from ".";

const getFramePixels = state => {
  const frame = getPaintFrame(state);
  const pixels = getFilePixels(state);
  return pixels[frame];
};

export default getFramePixels;
