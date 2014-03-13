var StatusBar = React.createClass({
  render: function() {
    var cssClasses = (this.props.editor.grid === true ? 'active' : '') + ' tiny transparent';

    return (
      <div id="StatusBar">
        <div id="StatusBarCoordinates">X: {this.props.editor.pixel.x} | Y: {this.props.editor.pixel.y}</div>
        <div id="StatusBarButtons">
          <button id="toggleGrid" className={cssClasses} onClick={this.dispatchGridToggled} title="Toggle grid">
            <i className="fa fa-th"></i>
          </button>
        </div>
      </div>
    );
  },
  dispatchGridToggled: function(event) {
    this.props.signal.gridToggled.dispatch(!this.props.editor.grid);
  }
});