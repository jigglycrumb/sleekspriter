// returns the current onion frame in absolute number (i.e. frame number in the file)
import { createSelector } from "reselect";
import getTotalFrames from "./getTotalFrames";
import { getOnion, getPaintFrame } from "./inputSelectors";

const getOnionFrameAbsolute = createSelector(
  [getTotalFrames, getOnion, getPaintFrame],
  (totalFrames, onion, paintFrame) => {
    let onionFrame = onion.frame[onion.mode];
    if(onion.mode === "relative") onionFrame = onionFrame + paintFrame;
    if(onionFrame > totalFrames) onionFrame = onionFrame - totalFrames;
    if(onionFrame < 1) onionFrame = onionFrame + totalFrames;
    return onionFrame;
  });

export default getOnionFrameAbsolute;
