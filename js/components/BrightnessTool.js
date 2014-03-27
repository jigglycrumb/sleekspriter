var BrightnessTool = React.createClass({
  getInitialState: function() {
    return {
      mode: 'lighten' // 'darken'
    };
  },
  render: function() {

    var lClass = 'small transparent active',
        lDisabled = true,
        dClass = 'small',
        dDisabled = false;

    if(this.state.mode == 'darken') {
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
        <span className="spacer"></span>
        <span className="hint">Give me some text.</span>
      </div>
    );
  },
  selectLightenTool: function() {
    this.setState({mode: 'lighten'});
  },
  selectDarkenTool: function() {
    this.setState({mode: 'darken'});
  }

});