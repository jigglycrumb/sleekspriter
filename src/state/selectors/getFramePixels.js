// returns a map containing the pixels of selected painting frame
import { createSelector } from "reselect";
import { getPaintFrame, getFilePixels } from "./inputSelectors";

const getFramePixels = createSelector(
  [ getPaintFrame, getFilePixels ],
  (frame, pixels) => pixels[frame] || {}
);

export default getFramePixels;
