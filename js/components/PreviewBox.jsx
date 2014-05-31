/** @jsx React.DOM */
var PreviewBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    return (
      <div id="PreviewBox" className="box">
        <h4 className="foldable-handle">Preview</h4>
        <div className="foldable-fold">
          <PreviewBoxPreview id={this.props.editor.frame} width={this.props.editor.size.width} height={this.props.editor.size.height} />
        </div>
      </div>
    );
  }
});