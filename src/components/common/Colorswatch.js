import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

class Colorswatch extends React.Component {
  static propTypes = {
    selected: PropTypes.bool,
    color: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div
        className={classnames({
          colorswatch: true,
          selected: this.props.selected,
        })}
        style={{ background: this.props.color }}
        title={this.props.color}
        onClick={this.handleClick}
      />
    );
  }

  handleClick() {
    this.props.action(this.props.color);
  }
}

export default Colorswatch;
