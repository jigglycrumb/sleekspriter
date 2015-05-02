var ReferenceImage = React.createClass({

  render: function() {
    if(this.props.image === null) return false;
    else return (
      <img
        src={this.props.image.path}
        title={this.props.image.name} />
    );
  },
});