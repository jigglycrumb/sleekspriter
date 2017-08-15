const duplicateLayers = (layers, targetFrame, nextLayerId) => {
  let newLayers = [];
  for(let i = 0; i < layers.length; i++) {
    const newId = nextLayerId + i;
    let newLayer = Object.assign({}, layers[i]);
    newLayer.id = newId;
    newLayer.frame = targetFrame;
    newLayer.name = `${newLayer.name} copy`;
    newLayers.push(newLayer);
  }

  return newLayers;
};

export default duplicateLayers;
