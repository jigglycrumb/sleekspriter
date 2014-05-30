/** @jsx React.DOM */
var App = React.createClass({
  render: function() {

    var totalFrames = this.props.editor.frames.x * this.props.editor.frames.y,
        frames = [];

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      <div id="App">
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
        <div className="area offscreen">
          {frames.map(function(frame) {
            var id = 'OffscreenFrameCanvas-'+frame;
            return (
              <OffscreenFrameCanvas key={id} frame={frame} editor={this.props.editor} />
            );
          }, this)}

          <SelectionPattern editor={this.props.editor} />
        </div>
      </div>
    );
  },
  componentDidMount: function() {

    channel.subscribe('app.frame.select', this.updateProps);
    channel.subscribe('app.layer.select', this.updateProps);
    channel.subscribe('app.tool.select', this.updateProps);
    channel.subscribe('app.color.select', this.updateProps);
    channel.subscribe('app.pixel.select', this.updateProps);
    channel.subscribe('stage.grid.toggle', this.updateProps);
    channel.subscribe('stage.zoom.select', this.updateProps);

    channel.subscribe('file.layer.opacity.select', this.updateProps);
    channel.subscribe('file.layer.visibility.toggle', this.updateProps);
    return;

    //channel.subscribe('stage.grid.toggle', this.updateProps);
    //channel.subscribe('stage.zoom.select', this.updateProps);





    channel.subscribe('app.palette.select', this.updateProps);
    channel.subscribe('app.box.toggle', this.updateProps);


    channel.subscribe('app.brightnesstool.mode.select', this.updateProps);
    channel.subscribe('app.brightnesstool.intensity.select', this.updateProps);

    //channel.subscribe('app.layer.add', this.updateProps);


    channel.subscribe('file.layer.name.select', this.updateProps);



    channel.subscribe('stage.tool.move', this.updateProps);

  },
  updateProps: function() {
    //console.log('updating App props');
    this.setProps({editor: editor});
  },
  componentWillReceiveProps: function(props) {
    //console.log(props);
  }
});