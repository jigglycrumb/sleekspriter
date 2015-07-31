var App = React.createClass({
  mixins: [
    FluxMixin,
    StoreWatchMixin('FileStore', 'UiStore'),
  ],
  getStateFromFlux: function() {
    var flux = this.getFlux();

    return {
      ui: flux.store('UiStore').getData(),
      file: flux.store('FileStore').getData(),
    };
  },
  /*
  getInitialState: function() {
    return {
      subscriptions: {
        'layer.select': this.updateProps,
        'palette.select': this.updateProps,

        'layer.opacity.select': this.updateProps,
        'layer.visibility.toggle': this.updateProps,
        'layer.name.select': this.updateProps,
        'layer.add': this.updateProps,
        'layer.delete': this.updateProps,
        'layer.drop': this.updateProps,

        'size.set': this.updateProps,

        'animation.add': this.updateProps,
        'animation.delete': this.updateProps,
        'animation.select': this.updateProps,
        'animation.rename': this.updateProps,
        'animation.fps': this.updateProps,
        'animation.frame.add': this.updateProps,
        'animation.frame.delete': this.updateProps,

        'window.resize': this.updateProps,
      }
    }
  },
  */
  render: function() {
    var tabs = [],
        windowClasses = {};

        if(this.state.ui.tab !== 'start') {
          tabs.push('paint');
          if(this.state.ui.frames.total > 1) tabs.push('animate');
          tabs.push('export');
        }

        windowClasses['window'] = true;
        windowClasses[this.state.ui.tab] = true;
        windowClasses = classNames(windowClasses);

    return (
      <div className="app">
        <nav className="menu" ref="menu">
          {this.state.ui.tab === 'start' ? <label className="version">version @@version</label> :
            tabs.map(function(tab) {
              var label = tab[0].toUpperCase() + tab.substr(1, tab.length),
                  classes = classNames({
                    tab: true,
                    active: this.state.ui.tab === tab ? true : false,
                  });
              return (
                <div className={classes} key={tab} data-target={tab} onClick={this.tabSelect}>{label}</div>
              )
            }, this)}
        </nav>
        <div className={windowClasses}>
          <ScreenStart />

          <ScreenPaint
            editor={this.props.editor}
            ui={this.state.ui}
            file={this.state.file}
            layer={this.state.layer} />

          <ScreenAnimate ui={this.state.ui} file={this.state.file} editor={this.props.editor} />
          <ScreenExport ui={this.state.ui} file={this.state.file} editor={this.props.editor} />
          <ScreenDebug ui={this.state.ui} />
        </div>
        <Modal
          editor={this.props.editor} 
          visible={this.state.ui.modal.visible}
          component={this.state.ui.modal.component}
          ui={this.state.ui}
          file={this.state.file}
          data={this.state.ui.modal.data} />
      </div>
    );
  },
  tabSelect: function(event) {
    var target = event.target.getAttribute('data-target');
    this.getFlux().actions.tabSelect(target);
  },
});