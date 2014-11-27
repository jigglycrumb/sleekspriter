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
      <div className={cssClasses} onDragOver={this.preventDefault} onDrop={this.drop}>
        {this.props.text}
      </div>
    )
  },

  preventDefault: function(event) {
    event.preventDefault();
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

  },
});