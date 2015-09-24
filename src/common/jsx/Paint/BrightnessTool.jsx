var BrightnessTool = React.createClass({
  mixins: [FluxMixin],
  render: function() {

    function capitaliseFirstLetter(string) { // used in the brightness tool
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var lClass = 'small transparent active',
        lDisabled = true,
        dClass = 'small',
        dDisabled = false;

    if(this.props.ui.brightnessTool.mode == 'darken') {
        lClass = 'small',
        lDisabled = false,
        dClass = 'small transparent active',
        dDisabled = true;
    }

    return (
      <div id="Brightness-Tool" className="ToolComponent">
        <i className="icon flaticon-sun4"></i>
        <button onClick={this.selectLightenTool} className={lClass} disabled={lDisabled} title="Lighten pixels"><i className="flaticon-clear325"></i></button>
        <button onClick={this.selectDarkenTool} className={dClass} disabled={dDisabled} title="Darken pixels"><i className="flaticon-clear3"></i></button>

        <input type="range" min="1" max="100" value={this.props.ui.brightnessTool.intensity} onChange={this.setIntensity} />
        <span>{capitaliseFirstLetter(this.props.ui.brightnessTool.mode)} by</span>
        <input type="number" min="1" max="100" value={this.props.ui.brightnessTool.intensity} onChange={this.setIntensity} />
        <span>%</span>

        <span className="spacer"></span>
        <span className="hint">Make existing pixels brighter or darker with this brush.</span>
      </div>
    );
  },
  selectLightenTool: function() {
    this.getFlux().actions.brightnessToolMode('lighten');
  },
  selectDarkenTool: function() {
    this.getFlux().actions.brightnessToolMode('darken');
  },
  setIntensity: function(event) {
    this.getFlux().actions.brightnessToolIntensity(event.target.value);
  },
});