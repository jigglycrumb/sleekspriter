var FoldableMixin = {
  fold: function() {
    this.getFlux().actions.boxFold(this.props.fold);
  },
};