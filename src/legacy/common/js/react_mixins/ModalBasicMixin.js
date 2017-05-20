// requires [FluxMixin] on the Modal component to work
var ModalBasicMixin = {
  hide: function() {
    this.getFlux().actions.modalHide();
  },
};

module.exports = ModalBasicMixin;
