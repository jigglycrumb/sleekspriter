var ScreenStart = React.createClass({
  render: function() {
    return (
      <section className="screen start">
        <div className="splash">
          <div className="inner">
            <div className="logo">@@name</div>
            <ul>
              <li><a onClick={this.newFile}>New file</a></li>
            </ul>
          </div>
        </div>
        <div className="area statusbar">
          <div className="bar">

          </div>
        </div>
      </section>
    )
  },
  newFile: function() {
    channel.gui.publish('screen.select', {target: 'paint'});
    channel.gui.publish('modal.show', {component: ModalNewFile});
  },
});