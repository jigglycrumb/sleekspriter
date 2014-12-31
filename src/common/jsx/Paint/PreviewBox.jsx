var PreviewBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    return (
      <div id="PreviewBox" className="box">
        <h4 className="foldable-handle">Preview</h4>
        <div className="foldable-fold">
          <PreviewBoxPreview 
            id={this.props.editor.frames.selected}
            width={this.props.editor.file.size.width}
            height={this.props.editor.file.size.height}
            alwaysRefresh={true} />
        </div>
      </div>
    );
  }
});