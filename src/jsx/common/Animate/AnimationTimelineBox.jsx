var AnimationTimelineBox = React.createClass({
  render: function() {

    var frameSize = 120,
        dropzoneHtml = null,
        dropzoneClass = null,
        frames = [],
        animation;

    if(this.props.editor.animations.selected !== null) {
      animation = this.props.editor.animations.getSelected();
    }

    if(this.props.editor.animations.list.length === 0) {
      dropzoneHtml =  <div>
                        You have not defined any animations yet.<br />
                        Open the animation list in the bottom left corner of the screen to get started.
                      </div>

      dropzoneClass = 'full';
    }
    else if(this.props.editor.animations.selected === null) {
      dropzoneHtml =  <div>
                        You have not selected an animation yet.<br />
                        Open the animation list in the bottom left corner of the screen to get started.
                      </div>

      dropzoneClass = 'full';
    }
    else if(animation.frames.length === 0) {
      dropzoneHtml =  <div>
                        The animation "{this.props.editor.animations.selected}" does not contain any frames yet.<br />
                        Drag frames from the top left and drop them here to create your animation.
                      </div>

      dropzoneClass = 'full';
    }
    else {
      frames = animation.frames;
      dropzoneHtml =  <div>
                        <div className="dropzone-inner top" />
                        <div className="dropzone-inner center" />
                        <div className="dropzone-inner bottom" />
                      </div>
      dropzoneClass = 'default';
    }

    var finalElements = [],
        dropzoneKey = 1;
    frames.forEach(function(frame) {
      finalElements.push(frame);
      finalElements.push('dropzone');
    });

    return (
      <div id="AnimationTimelineBox">
        <h4>Timeline</h4>
        <div className="scroller">
          <div className="inner">
            <AnimationFrameDropzone cssClass={dropzoneClass} text={dropzoneHtml} />
            {finalElements.map(function(element) {
              if(element === 'dropzone') {
                var key = 'dropzone-'+dropzoneKey;
                dropzoneKey++;
                return (
                  <AnimationFrameDropzone key={key} cssClass={dropzoneClass} text={dropzoneHtml} />
                )
              }
              else return (
                <AnimationTimelineFrame key={element} frame={element} size={frameSize} editor={this.props.editor} />
              )
            }, this)}
          </div>
        </div>
      </div>
    );
  }
});