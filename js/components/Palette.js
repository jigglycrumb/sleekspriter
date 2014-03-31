var Palette = React.createClass({
  render: function() {
    return (
      <div className="palette">
      {this.props.editor.palettes.auto.map(function(color) {
        return (
          <PaletteSwatch color={color.hexString()} signal={this.props.signal} />
        );
      }, this)}
      </div>
    );
  }
});