import React from "react";
import { connect } from "react-redux";
import palettes from "../json/palettes";
import PalettePicker from "../views/paint/PalettePicker";
import Palette from "../views/paint/Palette";
import {
  brushColor,
  paletteSelect,
} from "../state/actions";

const mapStateToProps = (state) => {
  return {
    selected: state.ui.paint.palette,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    paletteSelect: (palette) => dispatch(paletteSelect(palette)),
    brushColor: (color) => dispatch(brushColor(color)),
  };
};

const PaletteContainer = (props) => {
  const palette = palettes[props.selected];
  return (
    <div className="palette">
      <PalettePicker palettes={palettes} palette={palette} paletteSelect={props.paletteSelect} />
      <Palette colors={palette.colors} brushColor={props.brushColor} />
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaletteContainer);
