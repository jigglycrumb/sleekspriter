import React from "react";
import classnames from "classnames";

class Layerbox extends React.Component {
  render() {

    let deleteButtonDisabled = false, //this.props.ui.layers.frame.length <= 1,
        handleClasses = {'foldable-handle': true},
        boxStyle = {display: 'block'};

    // if(this.props.ui.fold.layers === true) {
    //   handleClasses['folded'] = true;
    //   boxStyle.display = 'none';
    // }

    return (
      <div id="LayerBox" className="box">
        <h4 className={classnames(handleClasses)}>Layers</h4>
        <div className="foldable-fold" style={boxStyle}>
          <div ref="layers" className="layers">
          </div>
          <div className="actions">
            <button title="New layer above selected layer" className="tiny transparent">
              <i className="flaticon-plus25"></i>
            </button>
            <button title="Delete selected layer" className="tiny transparent" disabled={deleteButtonDisabled}>
              <i className="flaticon-minus18"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Layerbox;
