var AnimationFrameDropzone = React.createClass({
  propTypes: {
    text: React.PropTypes.object,
  },
  render: function() {
    var cssClasses = {
      dropzone: true,
    };

    if(this.props.cssClass) cssClasses[this.props.cssClass] = true;
    cssClasses = classNames(cssClasses);

    var width;
    switch(this.props.cssClass) {
      case 'default': width = 15; break;
      case 'full': width = '100%'; break;
      case 'last':
        width = window.innerWidth - (this.props.position*(120+2+15));
        if(width < 15) width = 15;
        break;
    }

    var style = { width: width };

    return (
      <div className={cssClasses} onDragOver={this.dragOver} onDragLeave={this.dragLeave} onDrop={this.drop} style={style}>
        {this.props.text}
      </div>
    )
  },
  setOver: function(event, over) {
    var method = over === true ? 'add' : 'remove';
    event.preventDefault();
    this.getDOMNode().classList[method]('over');
  },
  dragOver: function(event) {
    this.setOver(event, true);
  },
  dragLeave: function(event) {
    this.setOver(event, false);
  },
  drop: function (event) {
    this.setOver(event, false);

    if(this.props.animation !== null) {
      // try to get the dropped frame or bail out
      var frame;
      try { frame = JSON.parse(event.dataTransfer.getData('frame')) }
      catch (e) { return }

      var data = {
        animation: this.props.animation,
        frame: frame,
        position: this.props.position,
      };

      channel.file.publish('animation.frame.add', data);
    }
  },
});