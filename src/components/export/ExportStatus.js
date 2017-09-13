import React from "react";

class ExportStatus extends React.Component {
  state = {
    timer: null
  };

  render() {
    return (
      <div className="bar">{this.props.status}</div>
    );
  }

  componentDidUpdate() {
    if(this.state.timer === null && this.props.status.length > 0) {
      var timer = setTimeout(() => this.clearStatus(), 5000);
      this.setState({timer: timer});
    }
  }

  clearStatus() {
    this.setState({timer: null});
    this.props.setStatus("");
  }
}

export default ExportStatus;
