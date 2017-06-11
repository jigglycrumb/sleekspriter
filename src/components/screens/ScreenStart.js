import React from "react";

const ScreenStart = () => {
  return (
    <section className="screen start">
      <div className="splash">
        <div className="inner">
          <div className="logo">@@name</div>
          <ul>
            <li><a>New file</a></li>
            <li><a>Open file</a></li>
          </ul>
        </div>
      </div>
      <div className="area statusbar">
        <div className="bar">@@version</div>
      </div>
    </section>
  );
};

export default ScreenStart;
