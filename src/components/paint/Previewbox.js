import React from "react";
import PropTypes from "prop-types";
import { FrameCanvas } from "../canvases";

const Previewbox = props => {
  const maxWidth = 206,
    maxHeight = 120;

  let maxSize;
  if (props.size.width >= props.size.height) {
    maxSize = maxWidth; // scale to width
  } else {
    maxSize = maxHeight; // scale to height
  }

  let pixels;
  try {
    pixels = props.pixels[props.frame];
  } catch (e) {
    pixels = null;
  }

  return (
    <FrameCanvas
      frame={props.frame}
      layers={props.layers}
      size={props.size}
      maxSize={maxSize}
      noMargin={true}
      pixels={pixels}
    />
  );
};

Previewbox.propTypes = {
  size: PropTypes.object.isRequired,
  pixels: PropTypes.object.isRequired,
  layers: PropTypes.array.isRequired,
  frame: PropTypes.number.isRequired,
};

export default Previewbox;
