var App = React.createClass({
  mixins: [FluxMixin, TouchMixin, StoreWatchMixin('FileStore', 'UiStore', 'PixelStore')],
  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      ui: flux.store('UiStore').getData(),
      file: flux.store('FileStore').getData(),
      pixels: flux.store('PixelStore').getData(),
    };
  },
  render: function() {
    var tabs = [],
        windowClasses = {},
        appMenu = platformUtils.device == 'desktop' ? null : <AppMenu ui={this.state.ui} />;

        if(this.state.ui.tab !== 'start') {
          tabs.push('paint');
          if(this.state.ui.frames.total > 1) tabs.push('animate');
          tabs.push('export');
        }

        windowClasses['window'] = true;
        windowClasses[this.state.ui.tab] = true;
        windowClasses = classNames(windowClasses);

    var activeScreen;
    switch(this.state.ui.tab) {
      case 'start':
        activeScreen = <ScreenStart />;
        break;

      case 'paint':
        activeScreen = <ScreenPaint ui={this.state.ui} file={this.state.file} pixels={this.state.pixels} />;
        break;

      case 'animate':
        activeScreen = <ScreenAnimate ui={this.state.ui} file={this.state.file} pixels={this.state.pixels} />;
        break;

      case 'export':
        activeScreen = <ScreenExport ui={this.state.ui} file={this.state.file} pixels={this.state.pixels} />;
        break;
    }

    return (
      <div className="app">
        {appMenu}
        <nav className="menu" ref="menu">
          {this.state.ui.tab === 'start' ? <label className="version">version @@version</label> :
            tabs.map(function(tab) {
              var label = tab[0].toUpperCase() + tab.substr(1, tab.length),
                  classes = classNames({
                    tab: true,
                    active: this.state.ui.tab === tab ? true : false,
                  });
              return (
                <div className={classes} key={tab} data-target={tab} onClick={this.handleClick.bind(this, this.tabSelect)} onTouchStart={this.handleTouch.bind(this, this.tabSelect)}>{label}</div>
              );
            }, this)}
        </nav>
        <div className={windowClasses}>
          <ScreenHelper ui={this.state.ui} file={this.state.file} pixels={this.state.pixels} />
          <ScreenDebug />
          {activeScreen}
        </div>
        <Modal ui={this.state.ui} file={this.state.file} />
        <ScreenBlocker />
      </div>
    );
  },
  tabSelect: function(event) {
    var target = event.target.getAttribute('data-target');
    this.getFlux().actions.tabSelect(target);
  },
});
