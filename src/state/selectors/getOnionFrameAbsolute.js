// returns the current onion frame in absolute number (i.e. frame number in the file)
import { createSelector } from "reselect";
import getTotalFrames from "./getTotalFrames";

const getOnion = (state) => state.ui.paint.onion;
const getSelectedFrame = (state) => state.ui.paint.frame;

const getOnionFrameAbsolute = createSelector(
  [getTotalFrames, getOnion, getSelectedFrame],
  (totalFrames, onion, selectedFrame) => {
    let onionFrame = onion.frame[onion.mode];
    if(onion.mode === "relative") onionFrame = onionFrame + selectedFrame;
    if(onionFrame > totalFrames) onionFrame = onionFrame - totalFrames;
    if(onionFrame < 1) onionFrame = onionFrame + totalFrames;
    return onionFrame;
  });

export default getOnionFrameAbsolute;
