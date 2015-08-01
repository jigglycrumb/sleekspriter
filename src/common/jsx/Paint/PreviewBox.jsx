var PreviewBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    return (
      <div id="PreviewBox" className="box">
        <h4 className="foldable-handle">Preview</h4>
        <div className="foldable-fold">
          <PreviewBoxPreview 
            id={this.props.ui.frames.selected}
            width={this.props.file.size.width}
            height={this.props.file.size.height}
            alwaysRefresh={true}
            ui={this.props.ui}
            file={this.props.file} />
        </div>
      </div>
    );
  }
});