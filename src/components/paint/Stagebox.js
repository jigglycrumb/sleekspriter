import React from "react";
import classnames from "classnames";
import config from "../../config";
import { GridCanvas } from "../canvases";
import { Point } from "../../classes";
import StageBoxCursorCanvas from "./StageBoxCursorCanvas";

const { offset } = config;

class Stagebox extends React.Component {
  constructor(props) {
    super(props);

    this.cursor = {x: 0, y: 0};
  }

  render() {
    const
      w = this.props.size.width * this.props.zoom,
      h = this.props.size.height * this.props.zoom,
      centerAreaWidth = window.innerWidth - offset.left - offset.right,
      centerAreaHeight = window.innerHeight - offset.top - offset.bottom;

    let css = {
      width: w,
      height: h,
    };

    const cssClasses = classnames({
      checkerboard: true //this.props.image === null ? true : false,
    });

    if( w > centerAreaWidth ) css.left = 0;
    else css.left = (centerAreaWidth - w)/2;

    if(css.left < 5) css.left = 5;

    if( h > centerAreaHeight ) css.top = 0;
    else css.top = (centerAreaHeight - h)/2;

    if(css.top < 5) css.top = 5;

    let grid = null;
    if(this.props.grid === true) {
      grid =  <GridCanvas
                width={w}
                height={h}
                columns={w / this.props.zoom}
                rows={h / this.props.zoom} />;
    }

    return (
      <div id="StageBox"
        className={cssClasses}
        style={css}
        onMouseMove={::this.mousemove}
        onMouseOut={::this.mouseout}>

        <StageBoxCursorCanvas ref="cursorCanvas" width={w} height={h} zoom={this.props.zoom} />
        {grid}
      </div>
    );
  }

  mousemove(e) {
    const point = this.getClickCoordinates(e);
    // console.log(e);
    this.updateCursor(point);
  }

  mouseout() {
    this.refs.cursorCanvas.clear();
  }




  updateCursor(point) {
    console.log(point);

    if((point.x > 0 && point.y > 0) &&
    (point.x !== this.cursor.x || point.y !== this.cursor.y)) {
      console.log("updating cursor!");

      // update cursor position
      this.cursor = point;
      this.refs.cursorCanvas.drawPixelCursor(point.x, point.y);

      document.getElementById("StatusBarCursorX").innerHTML = "X: " + point.x;
      document.getElementById("StatusBarCursorY").innerHTML = "Y: " + point.y;

    }
  }

  getClickCoordinates({ nativeEvent }) {
    return new Point(
      Math.ceil(nativeEvent.layerX / this.props.zoom),
      Math.ceil(nativeEvent.layerY / this.props.zoom)
    );
  }
}

export default Stagebox;
