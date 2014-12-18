var ModalBasicMixin = {
  hide: function() {
    channel.publish('modal.hide');
  },
};