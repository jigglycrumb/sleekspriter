import React from "react";
import classnames from "classnames";

class FrameboxOnionPanel extends React.Component {
  render() {
    const
      fixedTabClasses = classnames({
        tab: true,
        fixed: true,
        active: this.props.onion.mode == "fixed",
      }),
      fixedPanelClasses = classnames({
        "onion-settings": true,
        fixed: true,
        hidden: this.props.onion.mode != "fixed",
      }),

      relativeTabClasses = classnames({
        tab: true,
        relative: true,
        active: this.props.onion.mode == "relative",
      }),
      relativePanelClasses = classnames({
        "onion-settings": true,
        relative: true,
        hidden: this.props.onion.mode != "relative",
      }),
      totalFrames = this.props.frames.x * this.props.frames.y,
      frameLabel = this.props.onion.frame.relative == 1 ? " frame " : " frames ";

    return (
      <div className="onion-panel">
        <h4>Onion Skin</h4>
        <div className={fixedTabClasses} onClick={this.onionMode.bind(this, "fixed")}>Fixed</div>
        <div className={relativeTabClasses} onClick={this.onionMode.bind(this, "relative")}>Relative</div>
        <div className={fixedPanelClasses}>
          Onion is always frame <input type="number" min="1" max={totalFrames} value={this.props.onion.frame.fixed} onChange={::this.onionFrameFixed}/>
        </div>
        <div className={relativePanelClasses}>
          Onion is <input ref="onionRelativeNumber" type="number" min="1" max={totalFrames} value={Math.abs(this.props.onion.frame.relative)} onChange={::this.onionFrameRelative} />
          {frameLabel}
          <select ref="onionRelativePrefix" onChange={::this.onionFrameRelative}>
            <option value="+">ahead</option>
            <option value="-">behind</option>
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
    const
      prefix = this.refs.onionRelativePrefix.value,
      number = this.refs.onionRelativeNumber.value,
      val    = (prefix.toString()+number.toString());

    this.props.onionFrame("relative", val);
  }
}

export default FrameboxOnionPanel;
