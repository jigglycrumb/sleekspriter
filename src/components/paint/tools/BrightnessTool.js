import React from "react";
import PropTypes from "prop-types";
import { capitalizeFirstLetter, t } from "../../../utils";

class BrightnessTool extends React.Component {
  constructor(props) {
    super(props);
    this.selectDarkenTool = this.selectDarkenTool.bind(this);
    this.selectLightenTool = this.selectLightenTool.bind(this);
    this.setIntensity = this.setIntensity.bind(this);
  }

  render() {
    let lClass = "small transparent active";
    let lDisabled = true;
    let dClass = "small";
    let dDisabled = false;

    if (this.props.brightnessTool.mode === "darken") {
      lClass = "small";
      lDisabled = false;
      dClass = "small transparent active";
      dDisabled = true;
    }

    return (
      <div id="Brightness-Tool" className="ToolComponent">
        <i className="icon flaticon-sun4" />
        <button
          className={lClass}
          disabled={lDisabled}
          title={t("Lighten pixels")}
          onClick={this.selectLightenTool}>
          <i className="flaticon-dark26" />
        </button>
        <button
          className={dClass}
          disabled={dDisabled}
          title={t("Darken pixels")}
          onClick={this.selectDarkenTool}>
          <i className="flaticon-clear3" />
        </button>

        <input
          type="range"
          min="1"
          max="100"
          value={this.props.brightnessTool.intensity}
          onChange={this.setIntensity}
        />
        <span>
          {t(capitalizeFirstLetter(this.props.brightnessTool.mode))} {t("by")}
        </span>
        <input
          type="number"
          min="1"
          max="100"
          value={this.props.brightnessTool.intensity}
          onChange={this.setIntensity}
        />
        <span>%</span>

        <span className="spacer" />
        <span className="hint">
          {t("Make existing pixels brighter or darker with this brush.")}
        </span>
      </div>
    );
  }

  selectLightenTool() {
    this.props.brightnessToolMode("lighten");
  }

  selectDarkenTool() {
    this.props.brightnessToolMode("darken");
  }

  setIntensity(e) {
    this.props.brightnessToolIntensity(e.target.value);
  }
}

BrightnessTool.propTypes = {
  brightnessTool: PropTypes.shape({
    mode: PropTypes.string.isRequired,
    intensity: PropTypes.number.isRequired,
  }),
  brightnessToolMode: PropTypes.func.isRequired,
  brightnessToolIntensity: PropTypes.func.isRequired,
};

export default BrightnessTool;
