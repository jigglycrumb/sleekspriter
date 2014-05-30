var PostalSubscriptionMixin = {
  componentDidMount: function() {
    this.subscriptions = [];
    for(var x in this.state.subscriptions) {
      var topic = x,
          callback = this.state.subscriptions[x];

      channel.subscribe(topic, callback);
    }
  },
  componentWillUnmount: function() {
    this.subscriptions.forEach(function(subscription) {
      subscription.unsubscribe();
    });
  },
};