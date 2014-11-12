/** @jsx React.DOM */
var ScreenAnimate = React.createClass({
  render: function() {
    return (
      <section className="screen animate">
        <div className="area top">
          TIMELINE, PREVIEW
        </div>

        <div className="area center">
          FRAMES, ANIMATIONS
        </div>

        <div className="area bottom">
          <div className="bar">
            <label>STATUS</label>
          </div>
        </div>

        <div className="area left"></div>
        <div className="area right"></div>
      </section>
    )
  }
});