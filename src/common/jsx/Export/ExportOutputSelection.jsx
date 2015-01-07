var ExportOutputSelection = React.createClass({
  render: function() {
    var formats = ['png', 'jpg'];
    if(this.props.part === 'animation') {
      formats = ['gif', 'mov'];
    }

    return (
      <div>
        <h6>Output</h6>
        <ul>
          {/*<li>
            Folder <input type="text" />
            <input type="file" />
          </li>*/}
          <li>
            <select onChange={this.setFormat} value={this.props.format}>
              {formats.map(function(format) {
                return( <option key={format} value={format === 'jpg' ? 'jpeg' : format}>{format}</option> )
              }, this)}
            </select>
          </li>
        </ul>
      </div>
    )
  },
  setFormat: function(event) {
    channel.publish('export.format.set', {format: event.target.value});
  },
});