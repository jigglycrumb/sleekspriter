var FrameBoxOnionPanel = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    var fixedTabClasses = {
          tab: true,
          fixed: true,
          active: this.props.ui.onion.mode == 'fixed',
        }
        fixedPanelClasses = {
          'onion-settings': true,
          fixed: true,
          hidden: this.props.ui.onion.mode != 'fixed',
        },

        relativeTabClasses = {
          tab: true,
          relative: true,
          active: this.props.ui.onion.mode == 'relative',
        },
        relativePanelClasses = {
          'onion-settings': true,
          relative: true,
          hidden: this.props.ui.onion.mode != 'relative',
        },
        frameLabel = this.props.ui.onion.frame.relative == 1 ? ' frame ' : ' frames ';

    return (
      <div className="onion-panel">

        <h4>Onion Skin</h4>

        <div className={classNames(fixedTabClasses)} onClick={this.setOnionMode.bind(this, 'fixed')}>Fixed</div>
        <div className={classNames(relativeTabClasses)} onClick={this.setOnionMode.bind(this, 'relative')}>Relative</div>

        <div className={classNames(fixedPanelClasses)}>
          Onion is always frame <input type="number" min="1" max={this.props.ui.frames.total} value={this.props.ui.onion.frame.fixed} onChange={this.setOnionFrameFixed}/>
        </div>
        <div className={classNames(relativePanelClasses)}>
          Onion is <input ref="onionRelativeNumber" type="number" min="1" max={this.props.ui.frames.total} value={Math.abs(this.props.ui.onion.frame.relative)} onChange={this.setOnionFrameRelative} />
          {frameLabel}
          <select ref="onionRelativePrefix" onChange={this.setOnionFrameRelative}>
            <option value="+">ahead</option>
            <option value="-">behind</option>
          </select>
        </div>
      </div>
    )
  },
  setOnionMode: function(mode) {
    this.getFlux().actions.onionMode(mode);
  },
  setOnionFrameFixed: function(event) {
    this.getFlux().actions.onionFrame('fixed', +event.target.value);
  },
  setOnionFrameRelative: function(event) {
    var prefix = this.refs.onionRelativePrefix.getDOMNode().value,
        number = this.refs.onionRelativeNumber.getDOMNode().value,
        val    = +(prefix.toString()+number.toString());

    this.getFlux().actions.onionFrame('relative', val);
  },
});