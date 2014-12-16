var Modal = React.createClass({
  render: function() {
    return (
      <div id="Modal">
        <div className="inner">
          <ModalConfirmDeleteLayer />
        </div>
      </div>
    )
  }
});