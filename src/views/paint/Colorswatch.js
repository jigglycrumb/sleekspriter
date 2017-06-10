import React from "react";

class Colorswatch extends React.Component {
  render() {
    return (
      <div
        className="colorswatch"
        style={{background: this.props.color}}
        title={this.props.color}
        onClick={::this.handleClick} />
    );
  }

  handleClick() {
    this.props.action(this.props.color);
  }
}

export default Colorswatch;
