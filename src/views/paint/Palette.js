import React from "react";
import TWEEN from "tween.js";
import Colorswatch from "./Colorswatch";

class Palette extends React.Component {
  constructor(props) {
    super(props);
    this.swatchWidth = 28;
    this.swatchCount = props.colors.length;
  }

  render() {
    return (
      <div>
        <button ref="buttonScrollLeft" className="scroll left" onClick={::this.scrollLeft}>
          <i className="flaticon-arrow85"/>
        </button>
        <div ref="outer" className="outer">
          <div ref="inner" className="inner">
            {this.props.colors.map(function(color) {
              return <Colorswatch key={color} color={color} action={::this.props.brushColor} />;
            }, this)}
          </div>
        </div>
        <button ref="buttonScrollRight" className="scroll right" onClick={::this.scrollRight}>
          <i className="flaticon-mini7"/>
        </button>
      </div>
    );
  }

  componentDidMount() {
    this.setInnerWidth();
    this.scrollTo(0);
  }

  componentDidUpdate() {
    this.swatchCount = this.props.colors.length;
    this.setInnerWidth();
    this.scrollTo(0);
  }

  setInnerWidth() {
    const
      ow = this.getOuterWidth(),
      swatchesVisible = Math.floor(ow / this.swatchWidth),
      pages = Math.ceil(this.swatchCount / swatchesVisible),
      diff = ow - (swatchesVisible * this.swatchWidth),
      newWidth = (swatchesVisible * this.swatchWidth * pages) + diff;

    this.refs.inner.style.width = `${newWidth}px`;
  }

  getOuterWidth() {
    return this.refs.outer.clientWidth;
  }

  getInnerWidth() {
    return this.swatchWidth * this.swatchCount;
  }

  getScrollPosition() {
    return this.refs.outer.scrollLeft;
  }

  setScrollPosition(x) {
    this.refs.outer.scrollLeft = x;
  }

  scrollLeft() {
    const
      ow = this.getOuterWidth(),
      scroll = this.getScrollPosition(),
      swatchesVisible = Math.floor(ow / this.swatchWidth);

    let target = scroll - (this.swatchWidth * swatchesVisible);
    if(target < 0) target = 0;
    this.scrollTo(target);
  }

  scrollRight() {
    const
      ow = this.getOuterWidth(),
      scroll = this.getScrollPosition(),
      swatchesVisible = Math.floor(ow / this.swatchWidth),
      target = scroll + (this.swatchWidth * swatchesVisible);

    this.scrollTo(target);
  }

  scrollTo(x) {
    let tweenComplete = false;

    const
      self = this,
      start = this.getScrollPosition(),
      distance = x - start,
      from = { position: start },
      to = { position: start + distance };

    new TWEEN.Tween(from)
      .to(to, 200)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(function() {
        self.setScrollPosition(this.position);
      })
      .onComplete(function() {
        tweenComplete = true;
      })
      .start();

    this.setScrollButtons(x);

    (function animate() {
      if(!tweenComplete) {
        TWEEN.update();
        setTimeout(animate, 1);
      }
    })();
  }

  setScrollButtons(pos) {
    const
      iw = this.getInnerWidth(),
      ow = this.getOuterWidth(),
      w = iw - ow,
      swatchesVisible = Math.floor(ow / this.swatchWidth),
      pages = Math.ceil(this.swatchCount / swatchesVisible),
      scrollButtonStyle = {
        left: "hidden",
        right: "hidden",
      };

    if(pages > 1) {
      if(pos > 0) scrollButtonStyle.left = "visible";
      if(pos < w) scrollButtonStyle.right = "visible";
    }

    this.refs.buttonScrollLeft.style.visibility = scrollButtonStyle.left;
    this.refs.buttonScrollRight.style.visibility = scrollButtonStyle.right;
  }
}

export default Palette;
