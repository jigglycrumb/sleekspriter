var ModalBasicMixin = {
  hide: function() {
    channel.gui.publish('modal.hide');
  },
};