import React from "react";
import { connect } from "react-redux";
import { modalHide } from "../../state/actions";

const mapDispatchToProps = (dispatch) => {
  return {
    hide: () => dispatch(modalHide()),
  };
};

class ModalNewFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      frames: {
        x: 1,
        y: 1
      },
      pixels: {
        x: 1,
        y: 1
      }
    };
  }

  render() {
    var wrapperCss = {
      width: this.state.pixels.x * this.state.frames.x,
      height: this.state.pixels.y * this.state.frames.y
    };

    var fileType = this.state.frames.x * this.state.frames.y === 1 ? "Image" : "Spritesheet";

    return (
      <div className="dialog">
        <div className="title">New file</div>
        <div className="text">

          <div className="new-file-preview">
            <div className="new-file-preview-headline">Layout preview</div>
            <div className="new-file-preview-content" style={wrapperCss}>
              {/*<GridCanvas
                width={wrapperCss.width}
                height={wrapperCss.height}
                columns={this.state.frames.x}
                rows={this.state.frames.y} />*/}
            </div>
          </div>

          <ul className="new-file-frame-size">
            <li>
              <label>Frames:</label>
              <input type="number" ref="framesX" value={this.state.frames.x} min="1" onChange={::this.updateState} />
              x
              <input type="number" ref="framesY" value={this.state.frames.y} min="1" onChange={::this.updateState} />
            </li>
            <li>
              <label>Frame size:</label>
              <input type="number" ref="pixelsX" value={this.state.pixels.x} min="1" onChange={::this.updateState} />
              x
              <input type="number" ref="pixelsY" value={this.state.pixels.y} min="1" onChange={::this.updateState} />
              px
            </li>
            <li>
              <i ref="size">{fileType} size: {this.state.frames.x * this.state.pixels.x}x{this.state.frames.y * this.state.pixels.y} pixels</i>
            </li>
          </ul>
        </div>
        <div className="actions">
          <button onClick={this.createFile}>Ok</button>
          <button onClick={this.props.hide}>Cancel</button>
        </div>
      </div>
    );
  }

  updateState() {
    var size = {
      frames: {
        x: this.refs.framesX.value,
        y: this.refs.framesY.value,
      },
      pixels: {
        x: this.refs.pixelsX.value,
        y: this.refs.pixelsY.value,
      },
    };
    this.setState(size);
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ModalNewFile);
