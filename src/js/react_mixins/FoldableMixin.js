var FoldableMixin = {
  getInitialState: function() {
    return ({
      folded: false
    });
  },
  componentDidMount: function() {
    var self = this,
        handle = this.getDOMNode().querySelector('.foldable-handle'),
        fold = this.getDOMNode().querySelector('.foldable-fold');

    function doFold(isFolded) {
      if(isFolded) {
        fold.style.display = 'none';
        handle.classList.add('folded');
      }
      else {
        fold.style.display = 'block';
        handle.classList.remove('folded');
      }
    };

    handle.onclick = function() {
      workspace.data.folds[self.props.fold] = !self.props.workspace.data.folds[self.props.fold];
      doFold(workspace.data.folds[self.props.fold]);
      workspace.save();
      channel.publish('app.box.toggle');
    };

    doFold(self.props.workspace.data.folds[self.props.fold]);
  },
  componentWillUnmount: function() {
    var handle = this.getDOMNode().querySelector('.foldable-handle');
    handle.onclick = null;
  }
};