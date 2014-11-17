/** @jsx React.DOM */
var App = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      subscriptions: {
        'frame.select': this.updateProps,
        'layer.select': this.updateProps,
        'tool.select': this.updateProps,
        'color.select': this.updateProps,
        'cursor.set': this.updateProps,
        'palette.select': this.updateProps,
        'brightnesstool.mode.select': this.updateProps,
        'brightnesstool.intensity.select': this.updateProps,
        'background.select': this.updateProps,

        'settings.toggle': this.updateProps,
        'grid.toggle': this.updateProps,
        'zoom.select': this.updateProps,

        'file.layer.opacity.select': this.updateProps,
        'file.layer.visibility.toggle': this.updateProps,

        'file.save': this.updateProps,
      }
    }
  },
  render: function() {
    return (
      <div className="app">
        <nav className="menu" ref="menu">
          <div className="tab" data-target="paint">Paint</div>
          <div className="tab active" data-target="animate">Animate</div>
          <div className="tab" data-target="debug">Debug</div>
        </nav>
        <div className="window animate">
          <ScreenPaint editor={this.props.editor} workspace={this.props.workspace} />
          <ScreenAnimate editor={this.props.editor} />
          <ScreenDebug editor={this.props.editor} />
        </div>
      </div>
    );
  },
  updateProps: function() {
    this.setProps({editor: editor, workspace: workspace});
  },
  componentDidMount: function() {
    var menu = this.refs.menu.getDOMNode(),
        tabs = NodeList2Array(menu.querySelectorAll('.tab'));

    // bind tab click handlers
    tabs.forEach(function(el, i) {
      var target = el.getAttribute('data-target');
      el.onclick = function() {
        // move window to target screen
        var _win = document.querySelector('.window');
        _win.classList.remove('paint', 'animate', 'debug');
        _win.classList.add(target);

        // remove active state from all tabs
        tabs.forEach(function(tab) {
          tab.classList.remove('active');
        });

        // make clicked tab active
        el.classList.add('active');

        // emit screen.select message
        channel.publish('screen.select', {target: target});
      }
    });
  },
});