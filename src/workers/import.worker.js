// worker for image import
// return JSON like the raw *.pixels file format

self.onmessage = function(e) {
  const { frameSize, imageData, state, imageDimensions } = e.data;

  let json = {
    size: [frameSize.width, frameSize.height],
    frames: [state.frames.x, state.frames.y],
    layers: [],
    animations: [],
    pixels: [],
  };

  let i; // a counter

  // create layers
  const totalFrames = state.frames.x * state.frames.y;
  for (i = 1; i <= totalFrames; i++) {
    json.layers.push([i, i, `Layer ${i}`, 0, 100, 1]);
  }

  let frame = 1, // will also serve as layer id
    position = {
      canvas: { x: 1, y: 1 },
      frame: { x: 1, y: 1 },
    };

  // loop over image data and create pixels
  for (i = 0; i < imageData.data.length; i += 4) {
    const red = imageData.data[i],
      green = imageData.data[i + 1],
      blue = imageData.data[i + 2],
      alpha = (imageData.data[i + 3] / 255).toFixed(2);

    if (alpha > 0) {
      var pixel = [
        frame,
        position.frame.x,
        position.frame.y,
        red,
        green,
        blue,
        alpha,
      ];
      json.pixels.push(pixel);
    }

    if (position.frame.x == frameSize.width) {
      frame++;
      position.frame.x = 1;
    } else {
      position.frame.x++;
    }

    if (position.canvas.x == imageDimensions.width) {
      var row = Math.floor(
        position.canvas.y / (imageDimensions.height / state.frames.y)
      );

      frame = 1 + state.frames.x * row;

      position.frame.x = 1;

      if (position.canvas.y % (imageDimensions.height / state.frames.y) === 0) {
        position.frame.y = 1;
      } else {
        position.frame.y++;
      }

      position.canvas.x = 1;
      position.canvas.y++;
    } else {
      position.canvas.x++;
    }
  }

  self.postMessage(json);
};
