import { connect } from "react-redux";
import Previewbox from "../paint/Previewbox";
import {
  getFileSize,
  getFrameLayers,
  getFramePixels,
  getPaintFrame,
} from "../../state/selectors";

const mapStateToProps = state => ({
  frame: getPaintFrame(state),
  layers: getFrameLayers(state),
  pixels: getFramePixels(state),
  size: getFileSize(state),
});

export default connect(mapStateToProps)(Previewbox);
