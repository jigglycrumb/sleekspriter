import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

class NameEditable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputVisible: false,
    };
  }

  render() {
    let
      labelStyle = { display: "block" },
      inputStyle = { display: "none" };

    if(this.state.inputVisible === true) {
      labelStyle.display = "none";
      inputStyle.display = "block";
    }

    return (
      <div className="name">
        <label ref="nameLabel" style={labelStyle} onClick={::this.showNameInput}>
          {this.props.name}
        </label>

        <input
          ref="nameText"
          type="text"
          defaultValue={this.props.name}
          onKeyDown={::this.handleNameChange}
          onBlur={::this.handleNameChange}
          style={inputStyle} />
      </div>
    );
  }

  showNameInput() {
    this.setState({inputVisible: true}, function() {
      this.refs.nameText.focus();
    });
  }

  handleNameChange(event) {
    const
      oldName = this.props.name,
      newName = event.target.value.trim();

    // user pressed ESC, reset
    if(event.type === "keydown" && event.keyCode === 27) {
      this.refs.nameLabel.innerHTML = oldName;
      this.refs.nameText.value = oldName;
      this.setState({inputVisible: false});
      return;
    }

    // user pressed Return or input lost focus, check for name change and fire callback
    if(event.type === "blur" || (event.type === "keydown" && event.keyCode === 13)) {
      if(!_.isEmpty(newName)) {
        this.setState({inputVisible: false});
        this.props.callback(newName);
      }
    }
  }
}

NameEditable.propTypes = {
  name: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

export default NameEditable;
