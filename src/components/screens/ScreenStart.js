import React from "react";

class ScreenStart extends React.Component {
  render() {
    return (
      <section className="screen start">
        <div className="splash">
          <div className="inner">
            <div className="logo">@@name</div>
            <ul>
              <li><a onClick={::this.newFile}>New file</a></li>
              <li><a>Open file</a></li>
            </ul>
          </div>
        </div>
        <div className="area statusbar">
          <div className="bar">@@version</div>
        </div>
      </section>
    );
  }

  newFile() {
    this.props.modalShow("ModalNewFile");
  }
}

export default ScreenStart;
