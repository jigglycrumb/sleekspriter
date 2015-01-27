var ModalErrorSaveBeforeExport = React.createClass({
  mixins: [ModalBasicMixin],
  render: function() {
    return (
      <div className="dialog">
        <div className="title">Wait a second</div>
        <div className="text">The export automatically gets written to the folder where you saved your .pixels file. Please save your work before exporting.</div>
        <div className="actions">
          <button onClick={this.saveFile}>Ok, save now</button>
          <button onClick={this.hide}>Cancel and export later</button>
        </div>
      </div>
    )
  },
  saveFile: function() {
    clickInput('fileSave');
    this.hide();
  },
});