// Flux: done
var NameEditable = React.createClass({
  mixins: [TouchMixin],
  propTypes: {
    name: React.PropTypes.string.isRequired,
    callback: React.PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {
      inputVisible: false,
    }
  },
  render: function() {

    var labelStyle = {display: 'block'},
        inputStyle = {display: 'none'};

    if(this.state.inputVisible === true) {
      labelStyle.display = 'none';
      inputStyle.display = 'block';
    }

    return (
      <div className="name">
        <label
          ref="nameLabel"
          onClick={this.handleClick.bind(this, this.showNameInput)}
          onTouchStart={this.handleTouch.bind(this, this.showNameInput)}
          style={labelStyle}>{this.props.name}</label>

        <input
          ref="nameText"
          type="text"
          defaultValue={this.props.name}
          onKeyDown={this.handleNameChange}
          onBlur={this.handleNameChange}
          style={inputStyle} />
      </div>
    )
  },
  showNameInput: function() {
    this.setState({inputVisible: true}, function() {
      this.refs.nameText.focus();
    });
  },
  handleNameChange: function(event) {
    var oldName = this.props.name,
        newName = event.target.value.trim();

    // user pressed ESC, reset
    if(event.type === 'keydown' && event.keyCode === 27) {
      this.refs.nameLabel.innerHTML = oldName;
      this.refs.nameText.value = oldName;
      this.setState({inputVisible: false});
      return;
    }

    // user pressed Return or input lost focus, check for name change and fire callback
    if(event.type === 'blur' || (event.type === 'keydown' && event.keyCode === 13)) {
      if(!_.isEmpty(newName)) {
        this.setState({inputVisible: false});
        this.props.callback.call(null, newName);
      }
    }
  },
});
