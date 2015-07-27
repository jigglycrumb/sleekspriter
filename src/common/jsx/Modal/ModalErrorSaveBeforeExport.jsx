// Flux: done
var ModalErrorSaveBeforeExport = React.createClass({
  mixins: [FluxMixin, ModalBasicMixin],
  render: function() {
    return (
      <div className="dialog">
        <div className="title">Wait a second</div>
        <div className="text">
          The export gets written to the folder where you saved your .pixels file.
          Please save your work first and export again.</div>
        <div className="actions">
          <button onClick={this.saveFile}>Save now</button>
          <button onClick={this.hide}>Cancel</button>
        </div>
      </div>
    )
  },
  saveFile: function() {
    clickInput('fileSave');
    this.hide();
  },
});