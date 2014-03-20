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

    handle.onclick = function() {
      if(self.state.folded) {
        fold.style.display = 'block';
        handle.classList.remove('folded');
      }
      else {
        fold.style.display = 'none';
        handle.classList.add('folded');
      }
      self.setState({folded: !self.state.folded});
    }

  },
  componentWillUnmount: function() {
    var handle = this.getDOMNode().querySelector('.foldable-handle');
    handle.onclick = null;
  }
};