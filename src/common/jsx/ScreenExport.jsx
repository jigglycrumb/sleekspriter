var ScreenExport = React.createClass({
  render: function() {
    return (
      <section className="screen export">

        <div className="area left">
          <h5>Settings</h5>

          <h6>Export</h6>
          <ul>
            <li>
              <input type="radio" name="export-part" value="" />
              <label>Spritesheet as single image</label>
            </li>
            <li>
              <input type="radio" name="export-part" value="" />
              <label>Every frame as single image</label>
            </li>
            <li>
              <input type="radio" name="export-part" value="" />
              <label>Frame <input type="number" value="1" /> as image</label>
            </li>
            <li>
              <input type="radio" name="export-part" value="" />
              <label>Animation <select>
                <option>my awesome animation</option>
              </select></label>
            </li>
          </ul>

          <h6>Size</h6>
          <ul>
            <li>
              <input type="radio" name="export-size" value="" />
              <label>x1</label>
            </li>
            <li>
              <input type="radio" name="export-size" value="" />
              <label>x2</label>
            </li>
            <li>
              <input type="radio" name="export-size" value="" />
              <label>x4</label>
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
  }
});