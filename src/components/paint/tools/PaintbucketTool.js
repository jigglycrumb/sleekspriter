import React from "react";
import PaletteContainer from "../../containers/PaletteContainer";
import Colorswatch from "../Colorswatch";
import BrushColorpicker from "../BrushColorpicker";

class PaintbucketTool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pickerVisible: false
    };
  }

  render() {
    const picker = !this.state.pickerVisible
                 ? null
                 : <BrushColorpicker color={this.props.color} action={this.props.brushColor} />;

    return (
      <div id="PaintBucket-Tool" className="ToolComponent">
        <i className="icon flaticon-paint2"></i>
        <Colorswatch color={this.props.color} action={::this.togglePicker} />
        {picker}
        <span className="spacer"/>
        <div className="palette">
          <PaletteContainer />
        </div>
      </div>
    );
  }

  togglePicker() {
    this.setState({pickerVisible: !this.state.pickerVisible});
  }
}

export default PaintbucketTool;
