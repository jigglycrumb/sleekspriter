var ScreenHelper = React.createClass({
  render: function() {
    return (
      <section className="screen helper">
        <div className="area top">
          <h1>Helpers</h1>
        </div>

        <div className="area center">
          <SelectionPattern zoom={this.props.ui.zoom.selected} />
        </div>
      </section>
    );
  },
});