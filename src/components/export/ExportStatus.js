import React from "react";
import PropTypes from "prop-types";

class ExportStatus extends React.Component {
  render() {
    return <div className="bar">{this.props.status}</div>;
  }

  componentDidUpdate() {
    if (!this.timer && this.props.status.length > 0) {
      this.timer = setTimeout(this.clearStatus, 5000);
    }
  }

  clearStatus = () => {
    this.timer = undefined;
    this.props.setStatus("");
  };
}

ExportStatus.propTypes = {
  status: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
};

export default ExportStatus;
