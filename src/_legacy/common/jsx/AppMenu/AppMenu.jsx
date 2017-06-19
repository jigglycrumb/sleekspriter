var AppMenu = React.createClass({
  mixins: [FluxMixin, TouchMixin],
  render: function() {
    return (
      <div id="AppMenu">
        <div id="AppMenuToggle"
          onClick={this.handleClick.bind(this, this.toggle)}
          onTouchStart={this.handleTouch.bind(this, this.toggle)}>
            <i className="flaticon-list67"/>
        </div>
        <AppMenuWrapper visible={this.props.ui.menu.visible} />
      </div>
    );
  },
  toggle: function() {
    if(this.props.ui.menu.visible === true) {
      this.getFlux().actions.menuHide();
    }
    else {
      this.getFlux().actions.menuShow();
    }
  },
});
