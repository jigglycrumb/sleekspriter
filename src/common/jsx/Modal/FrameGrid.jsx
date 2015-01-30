var FrameGrid = React.createClass({
  render: function() {

    var rows = [];

    for(var y = 0; y < this.props.frames.y; y++) {
      var row = [];
      for(var x = 0; x < this.props.frames.x; x++) {
        row.push((x+1)*(y+1));
      }
      rows.push(row);
    }

    return (
      <table className="frame-grid">
        <tbody>
          {rows.map(function(row) {
            return (
              <tr key={row}>
                {row.map(function(cell) {
                  return (
                    <td key={cell} />
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
});