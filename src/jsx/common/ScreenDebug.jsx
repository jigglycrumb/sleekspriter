/** @jsx React.DOM */
var ScreenDebug = React.createClass({
  render: function() {
    return (
      <section className="screen debug">
        <h1>DEBUG</h1>

        <SelectionPattern zoom={this.props.editor.zoom.current} />
      </section>
    )
  }
});