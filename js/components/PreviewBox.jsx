/** @jsx React.DOM */
var PreviewBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    return (
      <div id="PreviewBox" className="box">
        <h4 className="foldable-handle">Preview</h4>
        <div className="foldable-fold">
          <PreviewBoxPreview frame={this.props.editor.frame} size={this.props.editor.size} />
        </div>
      </div>
    );
  }
});