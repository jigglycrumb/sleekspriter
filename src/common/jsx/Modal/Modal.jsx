var Modal = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    var component = null,
        style = {
          display: this.props.visible === true ? 'table' : 'none',
        };

    if(this.props.component !== null) {
      component = React.createElement(this.props.component, {
        editor: this.props.editor,
        ui: this.props.ui,
        file: this.props.file,
        data: this.props.data,
      });
    }

    return (
      <div id="Modal" style={style}>
        <div className="inner">
          {component}
        </div>
      </div>
    )
  },
});