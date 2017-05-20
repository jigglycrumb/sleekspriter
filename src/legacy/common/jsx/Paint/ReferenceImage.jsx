var ReferenceImage = React.createClass({
  mixins: [TouchMixin],
  getInitialState: function() {
    return {
      position: {
        dragging: false,
        x: 10,
        y: 10,
      },
    }
  },

  render: function() {
    if(this.props.image === null) return false;
    else {

      var style = {
        position: 'absolute',
        top: this.state.position.y,
        left: this.state.position.x,
        opacity: this.state.dragging === true ? 0.5 : 1,
      };

      return (
        <div id="ReferenceImage"
            style={style}
            onDragStart={this.dragStart}
            onDragEnd={this.dragEnd}
            onDrag={this.drag}>
          <img src={this.props.imageData} title={this.props.image.name} />
          <button className="remove" onClick={this.handleClick.bind(this, this.props.removeHandler)} onTouchStart={this.handleTouch.bind(this, this.props.removeHandler)}>✖</button>
        </div>
      );
    }
  },

  dragStart: function(e) {
    var img = document.createElement("img");
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    e.dataTransfer.setDragImage(img, 0, 0);
    this.setState({dragging: true});
  },

  drag: function(e) {
    var pos = {
          x: e.pageX - document.querySelector('.screen.paint .area.left').clientWidth - 3,
          y: e.pageY - document.querySelector('.screen.paint .area.top').clientHeight - 3
                     - document.querySelector('nav.menu').clientHeight,
        };

    if(pos.x < 0) pos.x = 0;
    if(pos.y < 0) pos.y = 0;
    this.setState({position: pos});
  },

  dragEnd: function() {
    this.setState({dragging: false});
  },
});
