var ExportStatus = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      subscriptions: {
        'export.finished': this.setStatus,
      }
    }
  },
  render: function() {
    return (
      <div className="bar" ref="bar"></div>
    )
  },
  setStatus: function(data, envelope) {
    var statusText, self = this;

    if(data.folder === null) statusText = 'Exported to '+data.name+'.'+(data.format === 'jpeg' ? 'jpg' : data.format);
    else {
      var path = require('path');
      if(data.part === 'allframes') {
        statusText = 'Exported '+data.frames+' frames as '+(data.format === 'jpeg' ? 'jpg' : data.format)+' to '+data.folder;
      }
      else statusText = 'Exported to '+data.folder+path.sep+data.name+'.'+(data.format === 'jpeg' ? 'jpg' : data.format);
    }
    this.refs.bar.getDOMNode().innerHTML = statusText;

    setTimeout(function() {
      self.refs.bar.getDOMNode().innerHTML = '';
    }, 5000);
  },
});