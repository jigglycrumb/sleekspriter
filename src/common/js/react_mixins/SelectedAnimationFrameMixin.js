// used in:
// AnimationControlBox
// AnimationTimelineBox
//
// depends on:
// PostalSubscriptionMixin

var SelectedAnimationFrameMixin = {
  getInitialState: function() {
    return {
      selectedFrame: 0,
      subscriptions: {
        'animation.frame.select': this.selectFrame,
        'animation.frame.delete': this.selectNewFrameAfterDelete,
      }
    }
  },
  selectFrame: function(data) {
    this.setState({selectedFrame: data.position});
  },
  selectNewFrameAfterDelete: function(data) {
    var frame = data.position - 1;
    if(frame < 0) frame = 0;

    this.setState({selectedFrame: frame});
  },
};