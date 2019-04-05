import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

class NameEditable extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      inputVisible: false,
    };

    this.showNameInput = this.showNameInput.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  render() {
    let labelStyle = { display: "block" };
    let inputStyle = { display: "none" };

    if (this.state.inputVisible === true) {
      labelStyle.display = "none";
      inputStyle.display = "block";
    }

    return (
      <div className="name">
        <label
          ref={n => (this.nameLabel = n)}
          style={labelStyle}
          onClick={this.showNameInput}>
          {this.props.name}
        </label>

        <input
          ref={n => (this.nameText = n)}
          type="text"
          defaultValue={this.props.name}
          onKeyDown={this.handleNameChange}
          onBlur={this.handleNameChange}
          style={inputStyle}
        />
      </div>
    );
  }

  showNameInput() {
    this.setState({ inputVisible: true }, function() {
      this.nameText.focus();
    });
  }

  handleNameChange(event) {
    const oldName = this.props.name;
    const newName = event.target.value.trim();

    // user pressed ESC, reset
    if (event.type === "keydown" && event.keyCode === 27) {
      this.nameLabel.innerHTML = oldName;
      this.nameText.value = oldName;
      this.setState({ inputVisible: false });
      return;
    }

    // user pressed Return or input lost focus, check for name change and fire callback
    if (
      event.type === "blur" ||
      (event.type === "keydown" && event.keyCode === 13)
    ) {
      if (!_.isEmpty(newName)) {
        this.setState({ inputVisible: false });
        this.props.callback(newName);
      }
    }
  }
}

export default NameEditable;
