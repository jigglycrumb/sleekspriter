import React from "react";
import PropTypes from "prop-types";

class ReferenceImage extends React.Component {
  constructor(props) {
    super(props);

    this.dragOffset = {
      x: 0,
      y: 0,
    };

    this.state = {
      dragging: false,
      position: {
        x: 10,
        y: 10,
      },
    };

    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
  }

  render() {
    if (this.props.image === null) return null;
    else {
      const style = {
        position: "absolute",
        top: this.state.position.y,
        left: this.state.position.x,
        opacity: this.state.dragging === true ? 0.5 : 1,
      };

      return (
        <div
          id="ReferenceImage"
          style={style}
          onDragStart={this.dragStart}
          onDragEnd={this.dragEnd}>
          <img src={this.props.imageData} title={this.props.image.name} />
          <button className="remove" onClick={e => this.props.removeHandler(e)}>
            ✖
          </button>
        </div>
      );
    }
  }

  dragStart(e) {
    const img = document.createElement("img");
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    e.dataTransfer.setDragImage(img, 0, 0);

    this.dragOffset.x = e.nativeEvent.layerX;
    this.dragOffset.y = e.nativeEvent.layerY;
    this.setState({ dragging: true });
  }

  dragEnd(e) {
    const pos = {
      x:
        e.pageX -
        document.querySelector(".screen.paint .area.left").clientWidth -
        3 -
        this.dragOffset.x,
      y:
        e.pageY -
        document.querySelector(".screen.paint .area.top").clientHeight -
        3 -
        this.dragOffset.y -
        document.querySelector("nav.menu").clientHeight,
    };

    if (pos.x < 0) pos.x = 0;
    if (pos.y < 0) pos.y = 0;
    this.dragOffset.x = 0;
    this.dragOffset.y = 0;
    this.setState({ position: pos, dragging: false });
  }
}

ReferenceImage.propTypes = {
  image: PropTypes.shape({
    name: PropTypes.string,
  }),
  imageData: PropTypes.string.isRequired,
  removeHandler: PropTypes.func.isRequired,
};

export default ReferenceImage;
