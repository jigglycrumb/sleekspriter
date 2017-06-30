import React from "react";
import { FrameCanvas } from "../canvases";

const Previewbox = (props) => {
  const
    maxWidth = 206,
    maxHeight = 120;

  let maxSize;
  if(props.size.width >= props.size.height) {
    maxSize = maxWidth; // scale to width
  }
  else {
    maxSize = maxHeight; // scale to height
  }

  let pixels;
  try { pixels = props.pixels[props.frame]; }
  catch(e) { pixels = null; }

  return (
    <FrameCanvas
      frame={props.frame}
      size={props.size}
      maxSize={maxSize}
      noMargin={true}
      pixels={pixels} />
  );
};

export default Previewbox;
