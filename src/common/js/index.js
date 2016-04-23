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
  // save type of action when dispatching
  flux.setDispatchInterceptor(function(action, dispatch) {
    console.log(action.type);
    flux.last = {
      action: action.type,
      payload: action.payload
    };
    //dispatch(action);
    ReactDOM.unstable_batchedUpdates(function() {
      dispatch(action);
    });
  });
}

var stores = {
  FileStore: new FileStore(),
  UiStore: new UiStore(),
  PixelStore: new PixelStore(),
},

flux = new Fluxxor.Flux(stores, actions),
platformUtils = new PlatformUtils(),
storeUtils = new StoreUtils(),
hotkeys = new Hotkeys(),
stateHistory = new StateHistory(),
container = document.getElementById('app-container');

platformUtils.boot();
