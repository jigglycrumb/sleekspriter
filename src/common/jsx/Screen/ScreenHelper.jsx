var ScreenHelper = React.createClass({
  render: function() {
    return (
      <section className="screen helper">
        <div className="area top">
          <h1>Helpers</h1>
        </div>

        <div className="area center">
          <SelectionPattern zoom={this.props.ui.zoom.selected} />
          <LayerCanvas zoom={1} layer={this.props.ui.layers.selected} file={this.props.file} pixels={this.props.pixels} />
        </div>
      </section>
    );
  },
});