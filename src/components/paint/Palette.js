import React from "react";
import TWEEN from "@tweenjs/tween.js";
import { Colorswatch } from "../common";
import PropTypes from "prop-types";

class Palette extends React.Component {
  constructor(props) {
    super(props);
    this.swatchWidth = 28;
    this.swatchCount = props.colors.length;

    this.handleScrollLeft = this.handleScrollLeft.bind(this);
    this.handleScrollRight = this.handleScrollRight.bind(this);
  }

  render() {
    return (
      <div>
        <button
          ref={n => (this.buttonScrollLeft = n)}
          className="scroll left"
          onClick={this.handleScrollLeft}>
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
          onClick={this.handleScrollRight}>
          <i className="flaticon-mini7" />
        </button>
      </div>
    );
  }

  componentDidMount() {
    this.setInnerWidth();
    this.scrollTo(0);
  }

  componentDidUpdate(prevProps) {
    this.swatchCount = this.props.colors.length;

    if (prevProps.colors.length !== this.swatchCount) {
      this.setInnerWidth();
      this.scrollTo(0);
    }
  }

  setInnerWidth() {
    const ow = this.getOuterWidth();
    const swatchesVisible = Math.floor(ow / this.swatchWidth);
    const pages = Math.ceil(this.swatchCount / swatchesVisible);
    const diff = ow - swatchesVisible * this.swatchWidth;
    const newWidth = swatchesVisible * this.swatchWidth * pages + diff;

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

  handleScrollLeft() {
    const ow = this.getOuterWidth();
    const scroll = this.getScrollPosition();
    const swatchesVisible = Math.floor(ow / this.swatchWidth);

    let target = scroll - this.swatchWidth * swatchesVisible;
    if (target < 0) target = 0;
    this.scrollTo(target);
  }

  handleScrollRight() {
    const ow = this.getOuterWidth();
    const scroll = this.getScrollPosition();
    const swatchesVisible = Math.floor(ow / this.swatchWidth);
    const target = scroll + this.swatchWidth * swatchesVisible;

    this.scrollTo(target);
  }

  scrollTo(x) {
    let tweenComplete = false;

    const self = this;
    const start = this.getScrollPosition();
    const distance = x - start;
    const from = { position: start };
    const to = { position: start + distance };

    new TWEEN.Tween(from)
      .to(to, 200)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(function({ position }) {
        self.setScrollPosition(position);
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
    const iw = this.getInnerWidth();
    const ow = this.getOuterWidth();
    const w = iw - ow;
    const swatchesVisible = Math.floor(ow / this.swatchWidth);
    const pages = Math.ceil(this.swatchCount / swatchesVisible);
    const scrollButtonStyle = {
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

Palette.propTypes = {
  colors: PropTypes.array,
  action: PropTypes.func,
  selected: PropTypes.string, // hex color string
};

export default Palette;
