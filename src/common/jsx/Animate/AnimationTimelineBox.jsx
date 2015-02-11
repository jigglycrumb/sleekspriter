var AnimationTimelineBox = React.createClass({
  mixins: [PostalSubscriptionMixin, SelectedAnimationFrameMixin],
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
                        <div className="helping-hand"><i className="flaticon-hand118"></i></div>
                        You have not defined any animations yet.<br />
                        Open the animation list in the bottom left corner of the screen to get started.
                      </div>

      dropzoneClass = 'full';
    }
    else if(this.props.editor.animations.selected === null) {
      dropzoneHtml =  <div>
                        <div className="helping-hand"><i className="flaticon-hand118"></i></div>
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
        dropzoneKey = 1,
        frameKey = 0;
    frames.forEach(function(frame) {
      finalElements.push(frame);
      finalElements.push('dropzone');
    });

    var innerStyle = {
      width: (frames.length*(frameSize+2+15))+15,
    };

    if(frames.length === 0) innerStyle.width = '100%';

    return (
      <div id="AnimationTimelineBox">
        <h4>Timeline</h4>
        <div className="scroller">
          <div ref="inner" className="inner" style={innerStyle}>
            <AnimationFrameDropzone cssClass={dropzoneClass} text={dropzoneHtml} position={0} animation={this.props.editor.animations.selected} />
            {finalElements.map(function(element) {
              if(element === 'dropzone') {
                var key = 'dropzone-'+dropzoneKey;
                dropzoneKey++;
                return (
                  <AnimationFrameDropzone key={key} cssClass={dropzoneClass} text={dropzoneHtml} position={dropzoneKey-1} animation={this.props.editor.animations.selected} />
                )
              }
              else {
                var key = 'frame-'+frameKey,
                    selected = this.state.selectedFrame === frameKey ? true : false;
                frameKey++;
                return (
                  <AnimationTimelineFrame key={key} frame={element} size={frameSize} position={frameKey-1} editor={this.props.editor} selected={selected} />
                )
              }
            }, this)}
          </div>
        </div>
      </div>
    );
  },
  selectFrame: function(data) {
    this.setState({selectedFrame: data.position, scroll: data.scroll});
  },
  componentDidUpdate: function() {
    if(this.state.scroll === true) {
      this.refs.inner.getDOMNode().querySelector('.frame.selected').scrollIntoView();
      this.setState({scroll: false});
    }
  },
});