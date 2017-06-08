import React from "react";
import classnames from "classnames";

class FrameboxFrame extends React.Component {
  render() {
    const
      id = `FrameBoxFrame-${this.props.frame}`,
      classes = classnames({
        "frame": true,
        "selected": this.props.frame == this.props.selected,
        // "onion": this.props.ui.onion.active === true && frame == onionFrame,
      }),
      frameStyle = {
        height: this.props.size,
        width: this.props.size,
      };

    return (
      <div key={id} className={classes} style={frameStyle} onClick={::this.select}>
        {/*<FrameCanvas frame={frame} file={this.props.file} pixels={this.props.pixels} maxSize={frameSize} />*/}
        {this.props.frame}
      </div>
    );
  }

  select() {
    this.props.frameSelect(this.props.frame);
  }
}

export default FrameboxFrame;
