// Flux: done
var Palette = React.createClass({
  mixins: [FluxMixin],
  getInitialState: function() {
    return {
      swatchWidth: 28,
      resetScroll: true, // true to fire resetScroll on first component update
    };
  },
  render: function() {

    var palettes  = this.props.ui.palettes.available,
        palette   = this.getSelectedPaletteData();

    return (
      <div className="palette">
        <div className="switch" onClick={this.showPalettes}>
          <i className="icon flaticon-color1"/>
          <i className="switch-arrow flaticon-little9"/>
          <div className="name">{palette.short}</div>
          <ul ref="paletteList" className="list">
            {palettes.map(function(palette, i) {
              return (
                <li key={i} data-palette={i} onClick={this.selectPalette}>{palette.title} ({palette.colors.length} colours)</li>
              );
            }, this)}
          </ul>
        </div>
        <button ref="buttonScrollLeft" className="scroll left" onClick={this.scrollLeft}>
          <i className="flaticon-arrow85"/>
        </button>
        <div className="outer">
          <div ref="inner" className="inner">
            {palette.colors.map(function(color) {
              return (
                <PaletteSwatch key={color} color={color} />
              );
            }, this)}
          </div>
        </div>
        <button ref="buttonScrollRight" className="scroll right" onClick={this.scrollRight}>
          <i className="flaticon-mini7"/>
        </button>
      </div>
    );
  },
  componentDidMount: function() {
    this.setInnerWidth();
    this.resetScroll();
  },
  componentDidUpdate: function() {
    this.setInnerWidth();
    if(this.state.resetScroll) {
      this.resetScroll();
      this.setState({resetScroll:false});
    }
  },
  getSelectedPaletteData: function() {
    return this.props.ui.palettes.available[this.props.ui.palettes.selected];
  },
  getSwatchCount: function() {
    return this.getSelectedPaletteData().colors.length;
  },
  getOuterWidth: function() {
    return ReactDOM.findDOMNode(this).querySelector('.outer').clientWidth;
  },
  getInnerWidth: function() {
    return this.state.swatchWidth*this.getSwatchCount();
  },
  setInnerWidth: function() {
    var ow = this.getOuterWidth(),
        swatches = this.getSwatchCount(),
        swatchesVisible = Math.floor(ow/this.state.swatchWidth),
        pages = Math.ceil(swatches/swatchesVisible),
        diff = ow - (swatchesVisible*this.state.swatchWidth),
        newWidth = (swatchesVisible*this.state.swatchWidth*pages)+diff;

    ReactDOM.findDOMNode(this).querySelector('.inner').style.width = newWidth+'px';
  },
  getScrollPosition: function() {
    return ReactDOM.findDOMNode(this).querySelector('.outer').scrollLeft;
  },
  setScrollPosition: function(x) {
    ReactDOM.findDOMNode(this).querySelector('.outer').scrollLeft = x;
  },
  setScrollButtons: function(pos) {
    var iw = this.getInnerWidth(),
        ow = this.getOuterWidth(),
        w = iw - ow,
        swatches = this.getSwatchCount(),
        swatchesVisible = Math.floor(ow/this.state.swatchWidth),
        pages = Math.ceil(swatches/swatchesVisible),

        scrollButtonStyle = {
          left: 'hidden',
          right: 'hidden',
        };

    if(pages > 1) {
      if(pos > 0) scrollButtonStyle.left = 'visible';
      if(pos < w) scrollButtonStyle.right = 'visible';
    }

    this.refs.buttonScrollLeft.style.visibility = scrollButtonStyle.left;
    this.refs.buttonScrollRight.style.visibility = scrollButtonStyle.right;
  },
  scrollTo: function(x) {
    var self = this,
        start = this.getScrollPosition(),
        distance = x - start,
        duration = 200,
        animationType = 'sineInOut',
        loop = false,
        tween = new Tween(start, distance, duration, animationType, loop);

    this.setScrollButtons(x);

    (function animate() {
      if(!tween.expired()) {
        self.setScrollPosition(tween.getValue());
        setTimeout(animate, 1);
      }
    })();
  },
  scrollLeft: function() {
    var ow = this.getOuterWidth(),
        scroll = this.getScrollPosition(),
        swatchesVisible = Math.floor(ow/this.state.swatchWidth),
        target = scroll - (this.state.swatchWidth*swatchesVisible);

    if(target < 0) target = 0;
    this.scrollTo(target);
  },
  scrollRight: function() {
    var ow = this.getOuterWidth(),
        scroll = this.getScrollPosition(),
        swatches = this.getSwatchCount(),
        swatchesVisible = Math.floor(ow/this.state.swatchWidth),
        target = scroll + (this.state.swatchWidth*swatchesVisible);

    this.scrollTo(target);
  },
  resetScroll: function() {
    this.scrollTo(0);
  },
  showPalettes: function() {
    this.refs.paletteList.style.display = 'block';
  },
  hidePalettes: function() {
    this.refs.paletteList.style.display = 'none';
  },
  selectPalette: function(event) {
    event.stopPropagation();
    var palette = event.currentTarget.getAttribute('data-palette');
    this.hidePalettes();
    this.getFlux().actions.paletteSelect(palette);
    this.setState({resetScroll:true});
  },
});
