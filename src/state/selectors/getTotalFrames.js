// returns the total number of frames in the file
import { createSelector } from "reselect";
import { getFileFrames } from "./inputSelectors";

const getTotalFrames = createSelector([ getFileFrames ], (frames) => frames.x * frames.y);

export default getTotalFrames;
