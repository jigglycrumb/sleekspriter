var App = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      tab: 'start',
      subscriptions: {
        'frame.select': this.updateProps,
        'layer.select': this.updateProps,
        'tool.select': this.updateProps,
        'color.select': this.updateProps,
        'palette.select': this.updateProps,
        'brightnesstool.mode.select': this.updateProps,
        'brightnesstool.intensity.select': this.updateProps,
        'background.select': this.updateProps,

        'settings.toggle': this.updateProps,
        'grid.toggle': this.updateProps,
        'zoom.select': this.updateProps,

        'layer.opacity.select': this.updateProps,
        'layer.visibility.toggle': this.updateProps,
        'layer.name.select': this.updateProps,
        'layer.add': this.updateProps,
        'layer.delete': this.updateProps,

        'animation.add': this.updateProps,
        'animation.delete': this.updateProps,
        'animation.select': this.updateProps,
        'animation.rename': this.updateProps,
        'animation.fps': this.updateProps,
        'animation.frame.add': this.updateProps,
        'animation.frame.delete': this.updateProps,

        'window.resize': this.updateProps,

        'screen.select': this.changeScreen,
      }
    }
  },
  render: function() {
    var tabs = [],
        windowClasses = {};

        if(this.state.tab !== 'start') {
          tabs.push('paint');
          if(this.props.editor.frames.total > 1) tabs.push('animate');
          tabs.push('export');
          tabs.push('debug');
        }

        windowClasses['window'] = true;
        windowClasses[this.state.tab] = true;
        windowClasses = React.addons.classSet(windowClasses);

    return (
      <div className="app">
        <nav className="menu" ref="menu">
          {this.state.tab === 'start' ? <label className="version">version @@version</label> :
            tabs.map(function(tab) {
              var label = tab[0].toUpperCase() + tab.substr(1, tab.length),
                  classes = React.addons.classSet({
                    tab: true,
                    active: this.state.tab === tab ? true : false,
                  });
              return (
                <div className={classes} key={tab} data-target={tab} onClick={this.selectTab}>{label}</div>
              )
            }, this)}
        </nav>
        <div className={windowClasses}>
          <ScreenStart />
          <ScreenPaint editor={this.props.editor} workspace={this.props.workspace} />
          <ScreenAnimate editor={this.props.editor} />
          <ScreenExport editor={this.props.editor} />
          <ScreenDebug editor={this.props.editor} />
        </div>
        <Modal editor={this.props.editor} />
      </div>
    );
  },
  updateProps: function() {
    this.setProps({editor: editor, workspace: workspace});
  },
  selectTab: function(event) {
    var target = event.target.getAttribute('data-target');
    channel.publish('screen.select', {target: target});
    this.setState({tab: target});
  },
  changeScreen: function(data) {
    this.setState({tab: data.target});
  },
});