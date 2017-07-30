onmessage = function(e) {
  let json = {};

  console.log(e.data);

  postMessage(json);
};
