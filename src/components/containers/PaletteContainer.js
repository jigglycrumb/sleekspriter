import React from "react";
import { connect } from "react-redux";
import palettes from "../../json/palettes";
import PalettePicker from "../paint/PalettePicker";
import Palette from "../paint/Palette";
import {
  brushColor,
  paletteSelect,
} from "../../state/actions";

const mapStateToProps = (state) => ({
  spritePalette: state.ui.paint.spritePalette,
  selected: state.ui.paint.palette,
});

const mapDispatchToProps = (dispatch) => ({
  paletteSelect: (palette) => dispatch(paletteSelect(palette)),
  brushColor: (color) => dispatch(brushColor(color)),
});

const PaletteContainer = (props) => {
  const
    { selected, spritePalette, brushColor, paletteSelect } = props,
    palette = palettes[selected];

  if(selected === 0) palette.colors = spritePalette;

  return (
    <div className="palette">
      <PalettePicker palettes={palettes} palette={palette} paletteSelect={paletteSelect} />
      <Palette colors={palette.colors} brushColor={brushColor} />
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaletteContainer);
