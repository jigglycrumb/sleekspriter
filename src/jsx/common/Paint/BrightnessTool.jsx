/** @jsx React.DOM */
var BrightnessTool = React.createClass({
  render: function() {

    function capitaliseFirstLetter(string) { // used in the brightness tool
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var lClass = 'small transparent active',
        lDisabled = true,
        dClass = 'small',
        dDisabled = false;

    if(this.props.editor.brightnessTool.mode == 'darken') {
        lClass = 'small',
        lDisabled = false,
        dClass = 'small transparent active',
        dDisabled = true;
    }

    return (
      <div id="Brightness-Tool" className="ToolComponent">
        <i className="icon flaticon-sun4"></i>
        <button onClick={this.selectLightenTool} className={lClass} disabled={lDisabled} title="Lighten pixels"><i className="flaticon-dark26"></i></button>
        <button onClick={this.selectDarkenTool} className={dClass} disabled={dDisabled} title="Darken pixels"><i className="flaticon-clear3"></i></button>


        <input type="range" min="1" max="100" className="brightness-slider" value={this.props.editor.brightnessTool.intensity} onChange={this.setIntensity} />
        <span>{capitaliseFirstLetter(this.props.editor.brightnessTool.mode)} by</span>
        <input type="number" min="1" max="100" className="brightness-number" value={this.props.editor.brightnessTool.intensity} onChange={this.setIntensity} />
        <span>%</span>


        <span className="spacer"></span>
        <span className="hint">Make existing pixels brighter or darker with this brush.</span>
      </div>
    );
  },
  selectLightenTool: function() {
    channel.publish('brightnesstool.mode.select', {mode: 'lighten'});
  },
  selectDarkenTool: function() {
    channel.publish('brightnesstool.mode.select', {mode: 'darken'});
  },
  setIntensity: function(event) {
    var newIntensity = parseInt(event.target.value);
    channel.publish('brightnesstool.intensity.select', {intensity: newIntensity});
  }

});