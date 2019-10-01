import React from "react";
import PropTypes from "prop-types";

import { t } from "../../utils";

class PalettePicker extends React.Component {
  componentDidMount() {
    document.addEventListener("mousedown", this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleOutsideClick, false);
  }

  render() {
    return (
      <div
        className="switch"
        onClick={this.handlePalettesShow}
        ref={node => (this.node = node)}>
        <i className="icon flaticon-color1" />
        <i className="switch-arrow flaticon-little9" />
        <div className="name">{this.props.palette.short}</div>
        <ul ref={n => (this.paletteList = n)} className="list">
          {this.props.palettes.map(function(palette, i) {
            return (
              <li key={i} data-palette={i} onClick={this.handlePaletteSelect}>
                {t("${palette} (${size} colours)", {
                  palette: palette.title,
                  size: palette.colors.length,
                })}
              </li>
            );
          }, this)}
        </ul>
      </div>
    );
  }

  handlePalettesShow = () => {
    this.paletteList.style.display = "block";
  };

  handlePalettesHide = () => {
    this.paletteList.style.display = "none";
  };

  handlePaletteSelect = e => {
    e.stopPropagation();
    const palette = e.currentTarget.getAttribute("data-palette");
    this.handlePalettesHide();
    this.props.paletteSelect(palette);
  };

  handleOutsideClick = e => {
    if (!this.node.contains(e.target)) {
      this.handlePalettesHide();
    }
  };
}

PalettePicker.propTypes = {
  palette: PropTypes.object.isRequired,
  palettes: PropTypes.array.isRequired,
  paletteSelect: PropTypes.func.isRequired,
};

export default PalettePicker;
