var AnimationTimelineBox = React.createClass({
  getInitialState: function() {
    return {
      scroll: false,
    }
  },
  render: function() {

    var frameSize = 120,
        dropzoneHtml = null,
        dropzoneClass = null,
        frames = [],
        animation;

    if(this.props.ui.animations.selected !== null) {
      animation = storeUtils.animations.getSelected();
    }

    if(this.props.file.animations.length === 0) {
      var helpingHand = null;
      if(this.props.listVisible === false)
        helpingHand = <div className="helping-hand"><i className="flaticon-hand118"></i></div>

        dropzoneHtml =  <div>
                          {helpingHand}
                          You have not defined any animations yet.<br />
                          Open the animation list in the bottom left corner of the screen to get started.
                        </div>

      dropzoneClass = 'full';
    }
    else if(this.props.ui.animations.selected === null) {
      dropzoneHtml =  <div>
                        <div className="helping-hand"><i className="flaticon-hand118"></i></div>
                        You have not selected an animation yet.<br />
                        Open the animation list in the bottom left corner of the screen to get started.
                      </div>

      dropzoneClass = 'full';
    }
    else if(animation.frames.length === 0) {
      animation = storeUtils.animations.getSelected();
      dropzoneHtml =  <div>
                        The animation "{animation.name}" does not contain any frames yet.<br />
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
        dropzoneKey = 1,
        frameKey = 0;
    frames.forEach(function(frame, i) {
      finalElements.push(frame);
      if(i === frames.length-1) finalElements.push('dropzone-last');
      else finalElements.push('dropzone');
    });

    var innerStyle = {
      width: (frames.length*(frameSize+2+15))+15,
    };

    if(innerStyle.width < window.innerWidth || frames.length === 0) innerStyle.width = window.innerWidth;
    // if(frames.length === 0) innerStyle.width = '100%';

    return (
      <div id="AnimationTimelineBox">
        <h4>Timeline</h4>
        <div className="scroller">
          <div ref="inner" className="inner" style={innerStyle}>
            <AnimationFrameDropzone
              cssClass={dropzoneClass}
              text={dropzoneHtml} 
              position={0}
              animation={this.props.ui.animations.selected} />

            {finalElements.map(function(element) {
              if(element === 'dropzone') {
                var key = 'dropzone-'+dropzoneKey;
                dropzoneKey++;
                return (
                  <AnimationFrameDropzone 
                    key={key}
                    cssClass={dropzoneClass}
                    text={dropzoneHtml}
                    position={dropzoneKey-1} 
                    animation={this.props.ui.animations.selected} />
                )
              }
              else if(element === 'dropzone-last') {
                var key = 'dropzone-'+dropzoneKey;
                dropzoneKey++;
                return (
                  <AnimationFrameDropzone 
                    key={key}
                    cssClass="last"
                    text={dropzoneHtml}
                    position={dropzoneKey-1} 
                    animation={this.props.ui.animations.selected} />
                )
              }
              else {
                var key = 'frame-'+frameKey,
                    selected = this.props.ui.animations.frame === frameKey ? true : false;
                frameKey++;
                return (
                  <AnimationTimelineFrame
                    key={key}
                    frame={element}
                    size={frameSize}
                    position={frameKey-1}
                    ui={this.props.ui}
                    file={this.props.file}
                    selected={selected} />
                )
              }
            }, this)}
          </div>
        </div>
      </div>
    );
  },
  componentDidUpdate: function() {
    if(this.state.scroll === true) {
      this.refs.inner.getDOMNode().querySelector('.frame.selected').scrollIntoView();
      this.setState({scroll: false});
    }
  },
});