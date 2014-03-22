var PreviewBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    return (
      <div id="PreviewBox" className="box">
        <h4 className="foldable-handle">Preview</h4>
        <div className="foldable-fold">
          <PreviewBoxPreview frame={this.props.editor.frame} file={this.props.file} editor={this.props.editor} signal={this.props.signal} />
        </div>
      </div>
    );
  }
});