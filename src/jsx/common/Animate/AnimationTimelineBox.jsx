var AnimationTimelineBox = React.createClass({
  render: function() {

    var dropzoneHtml;

    if(this.props.editor.animations.list.length === 0) {
      dropzoneHtml =  <div>
                        You have not defined any animations yet.<br />
                        Open the animation list in the bottom left corner of the screen to get started.
                      </div>
    }
    else if(this.props.editor.animations.selected === null) {
      dropzoneHtml =  <div>
                        You have not selected an animation yet.<br />
                        Open the animation list in the bottom left corner of the screen to get started.
                      </div>
    }
    else if(this.props.editor.animations.getFrames(this.props.editor.animations.selected).length === 0) {
      dropzoneHtml =  <div>
                        The animation "{this.props.editor.animations.selected}" does not contain any frames yet.<br />
                        Drag frames from the top left and drop them here to create your animation.
                      </div>
    }
    else {
      dropzoneHtml =  <div>
                        HURZ!
                      </div>
    }


    return (
      <div id="AnimationTimelineBox">
        <h4>Timeline</h4>
        <div className="scroller">
          <div className="inner">
            <AnimationFrameDropzone text={dropzoneHtml} />
          </div>
        </div>
      </div>
    );
  }
});