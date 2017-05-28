import React from 'react';
import config from '../../../config';

const { min, max } = config.zoom;

const ZoomTool = (props) => {
  return (
    <div id="Zoom-Tool" className="ToolComponent">
      <i className="icon flaticon-magnifier5"></i>
      <button className="small" title="Zoom in">
        <i className="flaticon-plus25"></i>
      </button>
      <button className="small" title="Zoom out">
        <i className="flaticon-minus18"></i>
      </button>
      <input type="range" min={min} max={max} defaultValue={5} />
      <span>Zoom &times;</span>
      <input type="number" min={min} max={max} value={5} />
      <button className="small">Fit to screen</button>
      <span className="spacer"></span>
      <span className="hint">A pixel in your sprite is now {5} pixels on your screen.</span>
    </div>
  );
};

export default ZoomTool;
