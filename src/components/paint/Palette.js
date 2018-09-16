import React from "react";
import TWEEN from "tween.js";
import { Colorswatch } from "../common";

class Palette extends React.Component {
  constructor(props) {
    super(props);
    this.swatchWidth = 28;
    this.swatchCount = props.colors.length;

    this.scrollLeft = this.scrollLeft.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
  }

  render() {
    return (
      <div>
        <button
          ref={n => (this.buttonScrollLeft = n)}
          className="scroll left"
          onClick={this.scrollLeft}>
          <i className="flaticon-arrow85" />
        </button>
        <div ref={n => (this.outer = n)} className="outer">
          <div ref={n => (this.inner = n)} className="inner">
            {this.props.colors.map(function(color) {
              return (
                <Colorswatch
                  key={color}
                  color={color}
                  action={e => this.props.action(e)}
                  selected={color === this.props.selected}
                />
              );
            }, this)}
          </div>
        </div>
        <button
          ref={n => (this.buttonScrollRight = n)}
          className="scroll right"
          onClick={this.scrollRight}>
          <i className="flaticon-mini7" />
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
    const ow = this.getOuterWidth(),
      swatchesVisible = Math.floor(ow / this.swatchWidth),
      pages = Math.ceil(this.swatchCount / swatchesVisible),
      diff = ow - swatchesVisible * this.swatchWidth,
      newWidth = swatchesVisible * this.swatchWidth * pages + diff;

    this.inner.style.width = `${newWidth}px`;
  }

  getOuterWidth() {
    return this.outer.clientWidth;
  }

  getInnerWidth() {
    return this.swatchWidth * this.swatchCount;
  }

  getScrollPosition() {
    return this.outer.scrollLeft;
  }

  setScrollPosition(x) {
    if (this.outer) this.outer.scrollLeft = x;
  }

  scrollLeft() {
    const ow = this.getOuterWidth(),
      scroll = this.getScrollPosition(),
      swatchesVisible = Math.floor(ow / this.swatchWidth);

    let target = scroll - this.swatchWidth * swatchesVisible;
    if (target < 0) target = 0;
    this.scrollTo(target);
  }

  scrollRight() {
    const ow = this.getOuterWidth(),
      scroll = this.getScrollPosition(),
      swatchesVisible = Math.floor(ow / this.swatchWidth),
      target = scroll + this.swatchWidth * swatchesVisible;

    this.scrollTo(target);
  }

  scrollTo(x) {
    let tweenComplete = false;

    const self = this,
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
      if (!tweenComplete) {
        TWEEN.update();
        setTimeout(animate, 1);
      }
    })();
  }

  setScrollButtons(pos) {
    const iw = this.getInnerWidth(),
      ow = this.getOuterWidth(),
      w = iw - ow,
      swatchesVisible = Math.floor(ow / this.swatchWidth),
      pages = Math.ceil(this.swatchCount / swatchesVisible),
      scrollButtonStyle = {
        left: "hidden",
        right: "hidden",
      };

    if (pages > 1) {
      if (pos > 0) scrollButtonStyle.left = "visible";
      if (pos < w) scrollButtonStyle.right = "visible";
    }

    this.buttonScrollLeft.style.visibility = scrollButtonStyle.left;
    this.buttonScrollRight.style.visibility = scrollButtonStyle.right;
  }
}

export default Palette;
