function NodeList2Array(NodeList) {
  //return [ ... NodeList ]; // ES6 version, doesn't work with JSX compiler
  return [].slice.call(NodeList);
}

function inArray(array, value) {
  return array.indexOf(value) > -1;
}

function fitCanvasIntoSquareContainer(canvasWidth, canvasHeight, containerSize) {
  var w = canvasWidth,
      h = canvasHeight,
      style = {},
      scale;

  if(w > h) scale = Math.floor(containerSize/w);
  else scale = Math.floor(containerSize/h);

  style.marginTop = Math.floor((containerSize - Math.round(h*scale))/2);
  style.marginLeft = Math.floor((containerSize - Math.round(w*scale))/2);

  w = Math.round(w*scale);
  h = Math.round(h*scale);

  return {
    width: w,
    height: h,
    style: style
  };
}

// fix for color.js darken/lighten functions
// uses absolute instead of relative strengths and works on black/white
function changeColorLightness(color, delta) {
  var newColor = new Color(color.rgb()),
      l = newColor.hsl().l;

  l+= delta;
  newColor.values.hsl[2] = l;
  newColor.setValues("hsl", newColor.values.hsl);
  return newColor;
}

function setupFluxDispatcher() {

  flux.setDispatchInterceptor(function(action, dispatch) {

    console.log(action.type, action.payload);

    // save last action info
    stateHistory.last.action = action.type;
    stateHistory.last.payload = action.payload;

    // dispatch
    dispatch(action);

    // add undo state (method decides if necessary, so we call it every time)
    // this won't work for async ops like paintbucket, those should take care of it themselves
    var async = ['PAINTBUCKET'];
    if(!inArray(async, action.type)) {
      stateHistory.addUndoState();
    }
  });
}

menuConfig = new MenuConfig();

stores.FileStore = new FileStore();
stores.UiStore = new UiStore();
stores.PixelStore = new PixelStore();

flux = new Fluxxor.Flux(stores, actions);
container = document.getElementById('app-container');

platformUtils.boot();
