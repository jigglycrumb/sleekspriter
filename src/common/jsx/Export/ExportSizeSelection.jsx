var ExportSizeSelection = React.createClass({
  getInitialState: function() {
    return {
      size: 1,
    }
  },
  render: function() {
    return (
      <div>
        <h6>Size</h6>
        <ul>
          <li>
            <input type="range" min={1} max={50} value={this.state.size} onChange={this.setSize} />
            <label>{this.state.size}</label>
          </li>
          <li>
            <i>File dimensions: 100x100 Pixels</i>
          </li>
        </ul>
      </div>
    )
  },
  setSize: function(event) {
    this.setState({size: +event.target.value});
    channel.publish('export.size.set', {size: +event.target.value});
  },
});