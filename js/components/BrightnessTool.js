var BrightnessTool = React.createClass({
  render: function() {

    var lClass = 'small transparent active',
        lDisabled = true,
        dClass = 'small',
        dDisabled = false;

    if(this.props.editor.brightnessToolMode == 'darken') {
        lClass = 'small',
        lDisabled = false,
        dClass = 'small transparent active',
        dDisabled = true;
    }

    return (
      <div id="Brightness-Tool" className="ToolComponent">
        <i className="flaticon-sun4"></i>
        <button onClick={this.selectLightenTool} className={lClass} disabled={lDisabled} title="Lighten pixels"><i className="flaticon-dark26"></i></button>
        <button onClick={this.selectDarkenTool} className={dClass} disabled={dDisabled} title="Darken pixels"><i className="flaticon-clear3"></i></button>


        <input type="range" min="1" max="100" className="brightness-slider" value={this.props.editor.brightnessToolIntensity} onChange={this.setIntensity} />
        <span>{capitaliseFirstLetter(this.props.editor.brightnessToolMode)} by</span>
        <input type="number" min="1" max="100" className="brightness-number" value={this.props.editor.brightnessToolIntensity} onChange={this.setIntensity} />
        <span>%</span>


        <span className="spacer"></span>
        <span className="hint">Make existing pixels brighter or darker with this brush.</span>
      </div>
    );
  },
  selectLightenTool: function() {
    this.props.signal.brightnessToolModeChanged.dispatch('lighten');
  },
  selectDarkenTool: function() {
    this.props.signal.brightnessToolModeChanged.dispatch('darken');
  },
  setIntensity: function(event) {
    var newIntensity = parseInt(event.target.value);
    this.props.signal.brightnessToolIntensityChanged.dispatch(newIntensity);
  }

});