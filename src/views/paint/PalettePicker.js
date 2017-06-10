import React from "react";

class PalettePicker extends React.Component {
  render() {
    return (
      <div className="switch" onClick={::this.showPalettes}>
        <i className="icon flaticon-color1"/>
        <i className="switch-arrow flaticon-little9"/>
        <div className="name">{this.props.palette.short}</div>
        <ul ref="paletteList" className="list">
          {this.props.palettes.map(function(palette, i) {
            return (
              <li key={i} data-palette={i} onClick={::this.selectPalette}>
                {palette.title} ({palette.colors.length} colours)
              </li>
            );
          }, this)}
        </ul>
      </div>
    );
  }

  showPalettes() {
    this.refs.paletteList.style.display = "block";
  }

  hidePalettes() {
    this.refs.paletteList.style.display = "none";
  }

  selectPalette(e) {
    e.stopPropagation();
    const palette = e.currentTarget.getAttribute("data-palette");
    this.hidePalettes();
    this.props.paletteSelect(palette);
  }
}

export default PalettePicker;
