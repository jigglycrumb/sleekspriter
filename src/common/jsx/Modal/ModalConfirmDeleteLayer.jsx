var ModalConfirmDeleteLayer = React.createClass({
  render: function() {

    var layer = {
      name: 'Test'
    }

    return (
      <div className="dialog">
        <div className="text">Are you sure you want to delete the layer "{layer.name}"?</div>
        <div className="actions">
          <button>Yes, please!</button>
          <button>Err, better not.</button>
        </div>
      </div>
    )
  },
});