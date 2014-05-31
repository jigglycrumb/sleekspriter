// Use only in <canvas> components
var CopyFrameMixin = {
  propTypes: {
    frame: React.PropTypes.number.isRequired, // frame id
  },
  componentDidMount: function() {
    this.subscription = channel.subscribe('stage.frame.update', this.prepareRefresh);
  },
  compontentWillUnmount: function() {
    this.subscription.unsubscribe();
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    };
  },
  prepareRefresh: function() {
    this.setState({needsRefresh: true});
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      this.drawFrame();
      this.setState({needsRefresh: false});
    }
  },
  drawFrame: function() {
    var w = this.getDOMNode().clientWidth,
        h = this.getDOMNode().clientHeight,
        sourceCanvas = document.getElementById('OffscreenFrameCanvas-'+this.props.frame);

    this.getDOMNode().width = this.getDOMNode().width; // clear canvas
    this.getDOMNode().getContext('2d').webkitImageSmoothingEnabled = false;
    this.getDOMNode().getContext('2d').drawImage(sourceCanvas, 0, 0, w, h);
  },
};
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
var FrameCanvasMixin = {
  propTypes: {
     id: React.PropTypes.number.isRequired,  // frame id
     width: React.PropTypes.number.isRequired, // file width
     height: React.PropTypes.number.isRequired, // file height
  },

  getInitialState: function() {
    return {
      needsRefresh: false,
      data: null,
      topic: null,
      subscriptions: {
        'stage.pixel.fill': this.checkRefresh,
        'stage.pixel.clear': this.checkRefresh,
      },
    };
  },
  checkRefresh: function(data, envelope) {
    if(this.props.id == data.frame) {
      this.setState({needsRefresh: true, data: data, topic: envelope.topic});
    }
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      var x = this.state.data.x,
          y = this.state.data.y,
          canvas = this.getDOMNode();

      // TODO: consider layers, clear to pixel below, don't fill if there's a pixel above

      switch(this.state.topic) {
        case 'stage.pixel.fill':
          var color = this.state.data.color;
          Pixel.fill(canvas, this.props.width, this.props.height, x, y, color);
          break;
        case 'stage.pixel.clear':
          Pixel.clear(canvas, this.props.width, this.props.height, x, y);
          break;
      }

      this.resetState();
    }
  },
};
var LayerCanvasMixin = {
  propTypes: {
     id: React.PropTypes.number.isRequired,  // layer id
     width: React.PropTypes.number.isRequired, // file width
     height: React.PropTypes.number.isRequired, // file height
  },
  getInitialState: function() {
    return {
      needsRefresh: false,
      data: null,
      topic: null,
      subscriptions: {
        'stage.pixel.fill': this.checkRefresh,
        'stage.pixel.clear': this.checkRefresh,
      },
    };
  },
  checkRefresh: function(data, envelope) {
    if(this.props.id == data.layer) {
      this.setState({needsRefresh: true, data: data, topic: envelope.topic});
    }
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      var x = this.state.data.x,
          y = this.state.data.y,
          canvas = this.getDOMNode();

      switch(this.state.topic) {
        case 'stage.pixel.fill':
          var color = this.state.data.color;
          Pixel.fill(canvas, this.props.width, this.props.height, x, y, color);
          break;
        case 'stage.pixel.clear':
          Pixel.clear(canvas, this.props.width, this.props.height, x, y);
          break;
      }

      this.resetState();
    }
  },
};
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
var ResetStateMixin = {
  resetState: function() {
    this.setState(this.getInitialState());
  },
};
var StageBoxCanvasMixin = {
  clear: function() {
    var canvas = this.getDOMNode();
    canvas.width = canvas.width;
  },
};