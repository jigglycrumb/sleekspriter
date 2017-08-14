const getPixelsInFrame = (frame, pixels) => {
  if(pixels[frame]) return pixels[frame];
  else return {};
};

export default getPixelsInFrame;
