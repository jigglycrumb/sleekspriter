// returns the total number of frames in the file
import { createSelector } from "reselect";

const getFileFrames = (state) => state.file.frames;
const getTotalFrames = createSelector([ getFileFrames ], (frames) => frames.x * frames.y);

export default getTotalFrames;
