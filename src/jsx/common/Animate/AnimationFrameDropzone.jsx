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
  setOver: function(event, over) {
    var method = over === true ? 'add' : 'remove';
    event.preventDefault();
    this.getDOMNode().classList[method]('over');
  },

  dragOver: function(event) {
    // event.preventDefault();
    // this.getDOMNode().classList.add('over');
    this.setOver(event, true);
  },

  dragLeave: function(event) {
    // event.preventDefault();
    // this.getDOMNode().classList.remove('over');
    this.setOver(event, false);
  },

  drop: function (event) {
    // event.preventDefault();
    // this.getDOMNode().classList.remove('over');
    this.setOver(event, false);

    var frame;

    try { frame = JSON.parse(event.dataTransfer.getData('frame')) }
    catch (e) { return }

    // Do something with the data
    console.log('dropped frame '+frame+' on dropzone #'+this.props.position);


  },
});