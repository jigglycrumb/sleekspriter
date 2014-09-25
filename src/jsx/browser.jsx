/** @jsx React.DOM */
var App = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      subscriptions: {
        'app.frame.select': this.updateProps,
        'app.layer.select': this.updateProps,
        'app.tool.select': this.updateProps,
        'app.color.select': this.updateProps,
        'app.cursor.set': this.updateProps,
        'app.palette.select': this.updateProps,
        'app.brightnesstool.mode.select': this.updateProps,
        'app.brightnesstool.intensity.select': this.updateProps,
        'app.background.select': this.updateProps,

        'stage.settings.toggle': this.updateProps,
        'stage.grid.toggle': this.updateProps,
        'stage.zoom.select': this.updateProps,
        //'stage.tool.move': this.updateProps,

        'file.layer.opacity.select': this.updateProps,
        'file.layer.visibility.toggle': this.updateProps,

        'file.save': this.updateProps,
      }
    }
  },
  render: function() {

    var totalFrames = this.props.editor.file.frames.x * this.props.editor.file.frames.y,
        frames = [],
        settingsBoxStyle = {
          display: this.props.editor.settingsVisible === true ? 'block' : 'none',
        };

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      <div className="app">
        <nav className="menu" ref="menu">
          <div className="tab active" data-target="paint">Paint</div>
          <div className="tab" data-target="animate">Animate</div>
        </nav>
        <div className="window paint">
          <section className="screen paint">
            <div className="area top">
              <ToolContainer editor={this.props.editor} />
            </div>
            <div className="area left">
              <ToolBox editor={this.props.editor} />
            </div>
            <div className="area center">
              <StageBox editor={this.props.editor} />
            </div>
            <div className="area right">
              <div id="layerboxhelper">
                <PreviewBox editor={this.props.editor} workspace={this.props.workspace} fold="preview" />
                <FrameBox editor={this.props.editor} workspace={this.props.workspace} fold="frames" />
              </div>
              <LayerBox editor={this.props.editor} workspace={this.props.workspace} fold="layers" />
            </div>
            <div className="area bottom">
              <StatusBar editor={this.props.editor} />
            </div>
            <div className="area settings" style={settingsBoxStyle}>
              <SettingsBox editor={this.props.editor} />
            </div>
            <div className="area offscreen">
              {frames.map(function(frame) {
                var id = 'OffscreenFrameCanvas-'+frame;
                return (
                  <OffscreenFrameCanvas
                    key={id}
                    id={frame}
                    width={this.props.editor.file.size.width}
                    height={this.props.editor.file.size.height}
                    selectedframe={this.props.editor.frame.selected} />
                );
              }, this)}

              <SelectionPattern editor={this.props.editor} />
            </div>
          </section>
          <section className="screen animation">
            <h1>ANIMATION</h1>
          </section>
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
        _win.classList.remove('paint', 'animate');
        _win.classList.add(target);

        // remove active state from all tabs
        tabs.forEach(function(tab) {
          tab.classList.remove('active');
        });

        // make clicked tab active
        el.classList.add('active');
      }
    });
  },
});