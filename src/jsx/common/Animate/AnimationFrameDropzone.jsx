var AnimationFrameDropzone = React.createClass({
  propTypes: {
    text: React.PropTypes.object,
  },
  render: function() {
    var cssClasses = {
      dropzone: true,
    };

    if(this.props.cssClass) cssClasses[this.props.cssClass] = true;
    cssClasses = React.addons.classSet(cssClasses);

    return (
      <div className={cssClasses} onDragOver={this.dragOver} onDragLeave={this.dragLeave} onDrop={this.drop}>
        {this.props.text}
      </div>
    )
  },

  dragOver: function(event) {
    event.preventDefault();
    this.getDOMNode().classList.add('over');
  },

  dragLeave: function(event) {
    event.preventDefault();
    this.getDOMNode().classList.remove('over');
  },

  drop: function (event) {

    event.preventDefault();

    var data;

    try {
      data = JSON.parse(event.dataTransfer.getData('frame'));
    } catch (e) {
      // If the text data isn't parsable we'll just ignore it.
      return;
    }

    // Do something with the data
    console.log(data);

    this.getDOMNode().classList.remove('over');
  },
});