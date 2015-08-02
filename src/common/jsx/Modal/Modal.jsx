// Flux: done, editor: done
var Modal = React.createClass({
  render: function() {
    var component = null,
        style = {
          display: this.props.ui.modal.visible === true ? 'table' : 'none',
        };

    if(this.props.ui.modal.component !== null) {
      component = React.createElement(this.props.ui.modal.component, {
        ui: this.props.ui,
        file: this.props.file,
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