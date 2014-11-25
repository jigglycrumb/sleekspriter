var AnimationFrameDropzone = React.createClass({
  propTypes: {
    text: React.PropTypes.object.isRequired,
  },
  render: function() {
    return (
      <div className="dropzone" onDragOver={this.preventDefault} onDrop={this.drop}>
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