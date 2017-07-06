import React from "react";
import { capitalizeFirstLetter, t } from "../../../utils";

class BrightnessTool extends React.Component {
  render() {
    let
      lClass = "small transparent active",
      lDisabled = true,
      dClass = "small",
      dDisabled = false;

    if(this.props.brightnessTool.mode == "darken") {
      lClass = "small";
      lDisabled = false;
      dClass = "small transparent active";
      dDisabled = true;
    }

    return (
      <div id="Brightness-Tool" className="ToolComponent">
        <i className="icon flaticon-sun4"></i>
        <button className={lClass} disabled={lDisabled} title={t("Lighten pixels")} onClick={::this.selectLightenTool}>
          <i className="flaticon-dark26"></i>
        </button>
        <button className={dClass} disabled={dDisabled} title={t("Darken pixels")} onClick={::this.selectDarkenTool}>
          <i className="flaticon-clear3"></i>
        </button>

        <input type="range" min="1" max="100" value={this.props.brightnessTool.intensity} onChange={::this.setIntensity} />
        <span>{t(capitalizeFirstLetter(this.props.brightnessTool.mode))} {t("by")}</span>
        <input type="number" min="1" max="100" value={this.props.brightnessTool.intensity} onChange={::this.setIntensity} />
        <span>%</span>

        <span className="spacer"></span>
        <span className="hint">{t("Make existing pixels brighter or darker with this brush.")}</span>
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

export default BrightnessTool;
