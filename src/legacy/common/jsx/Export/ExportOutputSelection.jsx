var ExportOutputSelection = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    var formats = ['png', 'jpg'];
    if(this.props.ui.export.part === 'animation') {
      formats = ['gif']; //, 'mov'];
    }

    return (
      <div>
        <h6>Output</h6>
        <ul>
          <li>
            <select onChange={this.setFormat} value={this.props.ui.export.format}>
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
    this.getFlux().actions.exportFormat(event.target.value);
  },
});