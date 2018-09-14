// returns the total number of frames in the file
import { getFileFrames } from "./inputSelectors";

const getTotalFrames = state => {
  const frames = getFileFrames(state);
  return frames.x * frames.y;
};

export default getTotalFrames;
