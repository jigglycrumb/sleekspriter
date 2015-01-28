var PostalSubscriptionMixin = {
  componentDidMount: function() {
    this.subscriptions = [];
    if("undefined" !== typeof this.state.subscriptions) {
      for(var x in this.state.subscriptions) {
        var topic = x,
            callback = this.state.subscriptions[x];

        this.subscriptions.push(channel.gui.subscribe(topic, callback));
      }
    }
  },
  componentWillUnmount: function() {
    this.subscriptions.forEach(function(subscription) {
      subscription.unsubscribe();
    });
  },
};