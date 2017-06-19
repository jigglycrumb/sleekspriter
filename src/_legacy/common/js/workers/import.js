// import worker

this.onmessage = function(e) {

  var json = {
    size: [e.data.frameSize.width, e.data.frameSize.height],
    frames: [e.data.state.frames.x, e.data.state.frames.y],
    layers: [],
    animations: [],
    pixels: [],
  };

  var i;

  // create layers
  var totalFrames = e.data.state.frames.x * e.data.state.frames.y;
  for(i = 1; i <= totalFrames; i++) {
    json.layers.push([i,i,"Layer "+i,0,100,1]);
  }

  var frame = 1, // will also serve as layer id
  position = {
    canvas: { x: 1, y: 1 },
    frame: { x: 1, y: 1 }
  };

  // loop over image data and create pixels
  for(i = 0; i < e.data.imageData.data.length; i+=4) {
    var red = e.data.imageData.data[i],
        green = e.data.imageData.data[i+1],
        blue = e.data.imageData.data[i+2],
        alpha = (e.data.imageData.data[i+3]/255).toFixed(2);

    if(alpha > 0) {
      var pixel = [frame, position.frame.x, position.frame.y, red, green, blue, alpha];
      json.pixels.push(pixel);
    }

    if(position.frame.x == e.data.frameSize.width) {
      frame++;
      position.frame.x = 1;
    }
    else {
      position.frame.x++;
    }

    if(position.canvas.x == e.data.imageDimensions.width) {
      var row = Math.floor(position.canvas.y/(e.data.imageDimensions.height/e.data.state.frames.y));

      frame = 1 + (e.data.state.frames.x * row);

      position.frame.x = 1;

      if(position.canvas.y%(e.data.imageDimensions.height/e.data.state.frames.y) === 0) {
        position.frame.y = 1;
      }
      else {
        position.frame.y++;
      }

      position.canvas.x = 1;
      position.canvas.y++;
    }
    else {
      position.canvas.x++;
    }
  }

  // post back the new file
  this.postMessage(json);
};
