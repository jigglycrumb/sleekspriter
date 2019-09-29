import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import palettes from "../../json/palettes";
import PalettePicker from "../paint/PalettePicker";
import Palette from "../paint/Palette";
import { brushColor, paletteSelect } from "../../state/actions";
import { getPalette, getSpritePalette } from "../../state/selectors";

const mapStateToProps = state => ({
  spritePalette: getSpritePalette(state),
  selected: getPalette(state),
});

const mapDispatchToProps = { brushColor, paletteSelect };

const PaletteContainer = props => {
  const { selected, spritePalette, brushColor, paletteSelect } = props;
  const palette = palettes[selected];

  if (selected === 0) palette.colors = spritePalette;

  return (
    <div className="palette">
      <PalettePicker
        palettes={palettes}
        palette={palette}
        paletteSelect={paletteSelect}
      />
      <Palette colors={palette.colors} action={brushColor} />
    </div>
  );
};

PaletteContainer.propTypes = {
  brushColor: PropTypes.func.isRequired,
  paletteSelect: PropTypes.func.isRequired,
  selected: PropTypes.number.isRequired,
  spritePalette: PropTypes.array.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaletteContainer);
