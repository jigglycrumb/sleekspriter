import React from "react";
import classnames from "classnames";
import { t } from "../../utils";

class FrameboxOnionPanel extends React.Component {
  render() {
    const fixedTabClasses = classnames({
        tab: true,
        fixed: true,
        active: this.props.onion.mode == "fixed"
      }),
      fixedPanelClasses = classnames({
        "onion-settings": true,
        fixed: true,
        hidden: this.props.onion.mode != "fixed"
      }),
      relativeTabClasses = classnames({
        tab: true,
        relative: true,
        active: this.props.onion.mode == "relative"
      }),
      relativePanelClasses = classnames({
        "onion-settings": true,
        relative: true,
        hidden: this.props.onion.mode != "relative"
      }),
      frameLabel =
        " " +
        (this.props.onion.frame.relative == 1 ? t("frame") : t("frames")) +
        " ";

    return (
      <div className="onion-panel">
        <h4>{t("Onion Skinning")}</h4>
        <div
          className={fixedTabClasses}
          onClick={this.onionMode.bind(this, "fixed")}
        >
          {t("Fixed")}
        </div>
        <div
          className={relativeTabClasses}
          onClick={this.onionMode.bind(this, "relative")}
        >
          {t("Relative")}
        </div>
        <div className={fixedPanelClasses}>
          {t("Onion is always frame")}{" "}
          <input
            type="number"
            min="1"
            max={this.props.totalFrames}
            value={this.props.onion.frame.fixed}
            onChange={::this.onionFrameFixed}
          />
        </div>
        <div className={relativePanelClasses}>
          {t("Onion is")}{" "}
          <input
            ref={n => (this.onionRelativeNumber = n)}
            type="number"
            min="1"
            max={this.props.totalFrames}
            value={Math.abs(this.props.onion.frame.relative)}
            onChange={::this.onionFrameRelative}
          />
          {frameLabel}
          <select
            ref={n => (this.onionRelativePrefix = n)}
            onChange={::this.onionFrameRelative}
          >
            <option value="+">{t("ahead")}</option>
            <option value="-">{t("behind")}</option>
          </select>
        </div>
      </div>
    );
  }

  onionMode(mode) {
    this.props.onionMode(mode);
  }

  onionFrameFixed(e) {
    this.props.onionFrame("fixed", e.target.value);
  }

  onionFrameRelative() {
    const prefix = this.onionRelativePrefix.value,
      number = this.onionRelativeNumber.value,
      val = prefix.toString() + number.toString();

    this.props.onionFrame("relative", val);
  }
}

export default FrameboxOnionPanel;
