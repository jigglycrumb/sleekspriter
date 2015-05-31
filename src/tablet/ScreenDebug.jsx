var ScreenDebug = React.createClass({
  render: function() {
    return (
      <section className="screen debug">
        <div className="area top">
          <h1>DEBUG</h1>
        </div>

        <div className="area center">
          <DebugLog />
        </div>

        <div className="area statusbar">
          <div className="bar">
            <label>Selection Pattern</label>
            <DebugSelectionPattern zoom={this.props.editor.zoom.current} />
          </div>
        </div>
      </section>
    )
  }
});