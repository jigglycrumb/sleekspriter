var Palette = React.createClass({
  render: function() {
    return (
      <div className="palette">
        <i className="icon flaticon-color1"/>

        <div className="outer">
          <button className="scroll left">
            <i className="flaticon-arrow85"/>
          </button>
          <div className="inner">
            {this.props.editor.palettes.auto.map(function(color) {
              return (
                <PaletteSwatch color={color.hexString()} signal={this.props.signal} />
              );
            }, this)}
          </div>
          <button className="scroll right">
            <i className="flaticon-mini7"/>
          </button>
        </div>

      </div>
    );
  }
});