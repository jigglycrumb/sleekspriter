// returns the current onion frame in absolute number (i.e. frame number in the file)
import getTotalFrames from "./getTotalFrames";
import { getOnion, getPaintFrame } from "./inputSelectors";

const getOnionFrameAbsolute = state => {
  const totalFrames = getTotalFrames(state);
  const onion = getOnion(state);
  const paintFrame = getPaintFrame(state);

  let onionFrame = onion.frame[onion.mode];
  if (onion.mode === "relative") onionFrame = onionFrame + paintFrame;
  if (onionFrame > totalFrames) onionFrame = onionFrame - totalFrames;
  if (onionFrame < 1) onionFrame = onionFrame + totalFrames;
  return onionFrame;
};

export default getOnionFrameAbsolute;
