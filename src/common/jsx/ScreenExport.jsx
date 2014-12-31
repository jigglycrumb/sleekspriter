var ScreenExport = React.createClass({
  getInitialState: function() {
    return {
      part: 'spritesheet',
      size: 1,
    }
  },
  render: function() {

    var parts = [
      {name: 'spritesheet', el: 'Spritesheet as single image'},
      {name: 'allframes', el: 'Every frame as single image'},
      {name: 'oneframe', el:  <span>
                                Frame&nbsp;
                                <input type="number" defaultValue="1" min={1} max={this.props.editor.frames.total} />
                                &nbsp;/&nbsp;
                                {this.props.editor.frames.total} as image
                              </span>},
      {name: 'animation', el: <span>
                                Animation&nbsp;
                                <select>
                                  <option>my awesome animation</option>
                                </select>
                              </span>},
    ];

    return (
      <section className="screen export">

        <div className="area left">
          <h5>Settings</h5>

          <h6>Export</h6>
          <ul>
            {parts.map(function(part) {
              var checked = part.name === this.state.part ? true : false;
              return (
                <li key={part.name}>
                  <label>
                    <input type="radio" name="export-part" value={part.name} onChange={this.setPart} checked={checked} />
                    {part.el}
                  </label>
                </li>
              );
            }, this)}
          </ul>

          <h6>Size</h6>
          <ul>
            <li>
              <input type="range" min={1} max={50} value={this.state.size} onChange={this.setSize} />
              <label>{this.state.size}</label>
            </li>
            <li>
              <i>File dimensions: 100x100 Pixels</i>
            </li>
          </ul>

          <h6>Output</h6>
          <ul>
            <li>
              Folder <input type="text" />
              <input type="file" />
            </li>
            <li>
              as
              <select>
                <option value="png">.png</option>
                <option value="jpg">.jpg</option>
                <option value="gif">.gif</option>
                <option value="mov">.mov</option>
              </select>
            </li>
          </ul>

          <button>Export</button>

        </div>

        <div className="area right">
          <ExportPreviewBox />
        </div>

        <div className="area statusbar">
          <div className="bar"></div>
        </div>
      </section>
    )
  },
  setPart: function(event) {
    this.setState({part: event.target.value});
  },
  setSize: function(event) {
    this.setState({size: event.target.value});
  },
});