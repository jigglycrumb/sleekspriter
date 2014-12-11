var Palette = React.createClass({
  getInitialState: function() {
    return {
      resetScroll: false,
    };
  },
  render: function() {

    var palettes = this.props.editor.palettes.available,
        palette = palettes[this.props.editor.palettes.selected];

    return (
      <div className="palette">
        <div className="switch" onClick={this.showPalettes}>
          <i className="icon flaticon-color1"/>
          <i className="switch-arrow flaticon-little9"/>
          <div className="name">{palette.short}</div>
          <ul ref="paletteList" className="list">
            {Object.keys(palettes).map(function(paletteKey) {
              var p = palettes[paletteKey];
              return (
                <li key={paletteKey} data-palette={paletteKey} onClick={this.selectPalette}>{p.title} ({p.colors.length} colours)</li>
              );
            }, this)}
          </ul>
        </div>
        <button ref="buttonScrollLeft" className="scroll left" onClick={this.scrollLeft}>
          <i className="flaticon-arrow85"/>
        </button>
        <div className="outer">
          <div className="inner">
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

    this.subscriptions = [
      //channel.subscribe('palette.select', this.prepareResetScroll)
    ];
  },
  componentDidUpdate: function() {
    this.setInnerWidth();

    if(this.state.resetScroll) {
      this.resetScroll();
      this.setState({resetScroll:false});
    }
  },
  componentDidUnmount: function() {
    this.subscriptions.forEach(function(subscription) {
      subscription.unsubscribe();
    });
  },
  getOuterWidth: function() {
    return this.getDOMNode().querySelector('.outer').clientWidth;
  },
  getInnerWidth: function() {
    var swatchWidth = 28,
        swatches = NodeList2Array(this.getDOMNode().querySelectorAll('.inner .colorswatch')).length;
    return swatchWidth*swatches;
  },
  setInnerWidth: function() {
    var swatchWidth = 28,
        ow = this.getOuterWidth(),
        swatches = NodeList2Array(this.getDOMNode().querySelectorAll('.inner .colorswatch')).length,
        swatchesVisible = Math.floor(ow/swatchWidth),
        pages = Math.ceil(swatches/swatchesVisible),
        diff = ow - (swatchesVisible*swatchWidth);

    this.getDOMNode().querySelector('.inner').style.width = ((swatchesVisible*swatchWidth*pages)+diff)+'px';
  },
  getScrollPosition: function() {
    return this.getDOMNode().querySelector('.outer').scrollLeft;
  },
  setScrollPosition: function(x) {
    this.getDOMNode().querySelector('.outer').scrollLeft = x;
  },
  scrollTo: function(x) {
    var interval,
        self = this,
        start = this.getScrollPosition(),
        distance = x - start,
        duration = 200,
        animationType = 'sineInOut',
        loop = false,
        tween = new Tween(start, distance, duration, animationType, loop);

    if(x == 0) this.refs.buttonScrollLeft.getDOMNode().style.visibility = 'hidden';
    else this.refs.buttonScrollLeft.getDOMNode().style.visibility = 'visible';

    var iw = this.getInnerWidth(),
        ow = this.getOuterWidth(),
        w = iw - ow,
        swatchWidth = 28,
        swatches = NodeList2Array(this.getDOMNode().querySelectorAll('.inner .colorswatch')).length,
        swatchesVisible = Math.floor(ow/swatchWidth),
        pages = Math.ceil(swatches/swatchesVisible);

    if(pages == 1) this.refs.buttonScrollRight.getDOMNode().style.visibility = 'hidden';
    else {
      if(x >= w) this.refs.buttonScrollRight.getDOMNode().style.visibility = 'hidden';
      else this.refs.buttonScrollRight.getDOMNode().style.visibility = 'visible';
    }

    (function animate() {
      if(!tween.expired()) {
        self.setScrollPosition(tween.getValue());
        setTimeout(animate, 1);
      }
    })();
  },
  scrollLeft: function() {
    var swatchWidth = 28,
        ow = this.getOuterWidth(),
        scroll = this.getScrollPosition(),
        swatchesVisible = Math.floor(ow/swatchWidth),
        target = scroll - (swatchWidth*swatchesVisible);

    if(target < 0) target = 0;
    this.scrollTo(target);
  },
  scrollRight: function() {
    var swatchWidth = 28,
        ow = this.getOuterWidth(),
        scroll = this.getScrollPosition(),
        swatches = NodeList2Array(this.getDOMNode().querySelectorAll('.inner .colorswatch')).length,
        swatchesVisible = Math.floor(ow/swatchWidth),
        target = scroll + (swatchWidth*swatchesVisible);

    this.scrollTo(target);
  },
  prepareResetScroll: function(palette) {
    if(this.isMounted()) this.setState({resetScroll: true});
  },
  resetScroll: function() {
    this.scrollTo(0);
  },
  showPalettes: function() {
    this.refs.paletteList.getDOMNode().style.display = 'block';
  },
  hidePalettes: function() {
    this.refs.paletteList.getDOMNode().style.display = 'none';
  },
  selectPalette: function(event) {
    var palette = event.currentTarget.getAttribute('data-palette');
    this.hidePalettes();
    channel.publish('palette.select', {palette: palette});
    return false;
  },
});