var ScreenDebug = React.createClass({
  render: function() {
    return (
      <section className="screen debug">
        <div className="area top">
          <h1>DEBUG</h1>

          <button onClick={this.showDevtools}>Open DevTools</button>
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
  },
  showDevtools: function() {
    // open devtools
    require('nw.gui').Window.get().showDevTools();
  },
});