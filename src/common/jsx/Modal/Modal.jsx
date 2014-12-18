var Modal = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      visible: false,
      component: null,
      data: null,
      subscriptions: {
        'modal.show': this.show,
        'modal.hide': this.hide,
      }
    }
  },
  render: function() {
    var component = null,
        style = {
          display: this.state.visible === true ? 'table' : 'none',
        };

    if(this.state.component !== null) {
      component = React.createElement(this.state.component, {
        editor: this.props.editor,
        data: this.state.data,
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
  show: function(data) {
    var component = data.component;
    delete data.component;
    this.setState({visible: true, component: component, data: data});
  },
  hide: function() {
    this.setState({visible: false, component: null, data: null});
  }
});