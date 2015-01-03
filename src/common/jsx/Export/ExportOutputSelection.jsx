var ExportOutputSelection = React.createClass({
  render: function() {
    return (
      <div>
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
      </div>
    )
  }
});