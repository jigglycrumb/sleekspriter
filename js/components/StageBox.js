var StageBox = React.createClass({
  render: function() {

    var w = this.props.io.size.width*this.props.editor.zoom,
        h = this.props.io.size.height*this.props.editor.zoom;

    var top = 40,
        left = 40,
        right = 200,
        bottom = 20,
        x = window.innerWidth/2,
        y = window.innerHeight/2;

    var cssleft = x-(w/2)-((right-left)/2),
        csstop = y-(h/2)+((top-bottom)/2);

    cssleft = (cssleft < left) ? left : cssleft;
    csstop = (csstop < top) ? top : csstop;

    return (
      <div id="StageBox" draggable="false" onDragStart={this.dragStart} onDragEnd={this.dragEnd} style={{width: w, height: h, left: cssleft, top: csstop}}>
        <StageBoxToolsLayer
          ref="ToolsLayer"
          width={w}
          height={h}
          editor={this.props.editor}
          signal={this.props.signal} />

        {this.props.io.layers.map(function(layer) {
          var id = 'StageBoxLayer-'+layer.id;
          return (
            <StageBoxLayer key={id} width={w} height={h} layer={layer}/>
          );
        }, this)}
      </div>
    );
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    }
  },
  componentDidMount: function() {
    this.props.signal.zoomChanged.add(this.onZoomChanged);
  },
  onZoomChanged: function() {
    this.setState({needsRefresh: true});
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      canvas.frame.refresh();
      this.setState({needsRefresh: false});
    }
  }
/*,
  dragStart: function(event) {
    console.log('dragStart', event);

    event.target.style.opacity = 0.4;
  },
  dragEnd: function(event) {

    var x = event.nativeEvent.pageX < 0 ? 0 : event.nativeEvent.pageX,
        y = (event.nativeEvent.pageY < 0 ? 0 : event.nativeEvent.pageY)/editor.zoom;

    console.log('dragEnd', x, y, event.nativeEvent);
    this.getDOMNode().style.left = x+'px';
    this.getDOMNode().style.top = y+'px';
    this.getDOMNode().style.opacity = 1;
  }*/
});