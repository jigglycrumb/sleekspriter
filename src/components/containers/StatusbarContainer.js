import { connect } from "react-redux";
import { ActionCreators } from "redux-undo";

import Statusbar from "../paint/Statusbar";

import { gridToggle } from "../../state/actions";
import { getFilePixels } from "../../state/selectors";
import { flattenPixels } from "../../utils";

const mapStateToProps = state => {
  const { frame, grid, zoom } = state.ui.paint;
  const pixels = getFilePixels(state);
  let pixelCount = 0;
  if (pixels[frame]) pixelCount = flattenPixels(pixels[frame]).length;

  return {
    frame: frame,
    grid: grid,
    zoom: zoom,
    canUndo: state.file.past.length > 0,
    canRedo: state.file.future.length > 0,
    pixelCount,
  };
};

const mapDispatchToProps = dispatch => ({
  gridToggle: () => dispatch(gridToggle()),
  undo: () => dispatch(ActionCreators.undo()),
  redo: () => dispatch(ActionCreators.redo()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Statusbar);
