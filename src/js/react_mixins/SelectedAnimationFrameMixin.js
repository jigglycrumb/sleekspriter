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
      }
    }
  },
  selectFrame: function(data) {
    this.setState({selectedFrame: data.position});
  },
};