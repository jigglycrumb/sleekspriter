/** @jsx React.DOM */
var PreviewBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    return (
      <div id="PreviewBox" className="box">
        <h4 className="foldable-handle">Preview</h4>
        <div className="foldable-fold">
          <PreviewBoxPreview id={this.props.editor.frame} width={this.props.editor.file.size.width} height={this.props.editor.file.size.height} />
        </div>
      </div>
    );
  }
});