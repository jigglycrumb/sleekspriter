var SettingsBox = React.createClass({
  render: function() {
    var checkerboardButtonClasses = classNames({
          'background': true,
          'checkerboard': true,
          'active': (this.props.editor.background.type === 'pattern' && this.props.editor.background.value === 'checkerboard') ? true : false,
        }),
        stripesButtonClasses = classNames({
          'background': true,
          'stripes-preview': true,
          'active': (this.props.editor.background.type === 'pattern' && this.props.editor.background.value === 'stripes' ) ? true : false,
        }),
        backgroundColorButtonClasses = classNames({
          'background': true,
          'active': (this.props.editor.background.type === 'color') ? true : false,
        }),
        backgroundColorButtonStyle = {
          'backgroundColor': (this.props.editor.background.type === 'color') ? this.props.editor.background.value : '#fff',
        };

    return (
      <div id="SettingsBox" className="box">
        <h4>Settings</h4>
        <ul>
          <li>
            <label>Background</label>
            <span>
              <button className={checkerboardButtonClasses} title="checkered" onClick={this.dispatchBackgroundSelected} data-type="pattern" data-value="checkerboard"></button>
              <button className={stripesButtonClasses} title="striped" onClick={this.dispatchBackgroundSelected} data-type="pattern" data-value="stripes"></button>
              <div className={backgroundColorButtonClasses} style={backgroundColorButtonStyle}>
                <input type="color" title="solid color" value={backgroundColorButtonStyle.backgroundColor} onChange={this.selectBackgroundColor} />
              </div>
            </span>
          </li>
        </ul>
      </div>
    )
  },
  selectBackgroundColor: function(event) {
    var data = {
      type: 'color',
      value: event.target.value
    };
    channel.gui.publish('background.select', data);
  },
  dispatchBackgroundSelected: function(event) {
    var data = {
      type: event.target.getAttribute('data-type'),
      value: event.target.getAttribute('data-value'),
    };
    channel.gui.publish('background.select', data);
  },

});