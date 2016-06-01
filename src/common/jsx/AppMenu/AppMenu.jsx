var AppMenu = React.createClass({
  getInitialState: function() {
    return {
      visible: false
    };
  },
  mixins: [TouchMixin],
  render: function() {
    return (
      <div id="AppMenu">
        <div id="AppMenuToggle"
          onClick={this.handleClick.bind(this, this.toggle)}
          onTouchStart={this.handleTouch.bind(this, this.toggle)}>
            <i className="flaticon-list67"/>
        </div>
        <AppMenuWrapper visible={this.state.visible} />
      </div>
    );
  },
  toggle: function() {
    this.setState({visible: !this.state.visible});
    console.log('toggle', this.state.visible);
  },
});
