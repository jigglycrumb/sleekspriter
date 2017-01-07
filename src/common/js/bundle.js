_ = require('lodash');
Fluxxor = require('fluxxor');
React = require('react');
ReactDOM = require('react-dom');
classNames = require('classnames');
Mousetrap = require('mousetrap');
// require('gif.js');
// Color = require('./lib/color');
// platformUtils = require('./classes/PlatformUtils');
Point = require('./classes/Point');
Pixel = require('./classes/Pixel');
hotkeys = require('./classes/Hotkeys');
// menuConfig = require('./classes/MenuConfig');
storeUtils = require('./classes/StoreUtils');
stateHistory = require('./classes/StateHistory');
utils = require('./classes/Utils');
// console.log(Menu);

constants = require('./flux/constants');
actions = require('./flux/actions');

// React Mixins
CanvasMixin = require('./react_mixins/CanvasMixin');
FoldableMixin = require('./react_mixins/FoldableMixin');
ModalBasicMixin = require('./react_mixins/ModalBasicMixin');
StageBoxCanvasMixin = require('./react_mixins/StageBoxCanvasMixin');
TouchMixin = require('./react_mixins/TouchMixin');

stores = {};

// stores = {
//   FileStore: require('./flux/stores/FileStore'),
//   UiStore: require('./flux/stores/UiStore'),
//   PixelStore: require('./flux/stores/PixelStore'),
// };

ColorPicker = require('react-color');


redux = require('redux');





// further init

FluxMixin = Fluxxor.FluxMixin(React);
StoreWatchMixin = Fluxxor.StoreWatchMixin;
