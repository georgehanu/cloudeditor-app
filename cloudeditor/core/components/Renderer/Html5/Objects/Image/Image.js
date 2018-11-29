const React = require("react");
const randomColor = require("randomcolor");
const CropperImage = require("../../CropperImage/CropperImage");

class ImageBlock extends React.PureComponent {
  state = {};
  constructor(props) {
    super(props);
    this.el = React.createRef();
    this.state = {
      ready: false
    };
  }
  componentDidMount() {
    this.setState({ ready: true });
  }
  render() {
    const { key, width, height, top, left, ...otherProps } = this.props;
    const style = {
      width: width,
      height: height,
      left: left,
      top: top,
      backgroundColor: randomColor()
    };
    let cropper = null;
    if (this.state.ready) {
      cropper = (
        <CropperImage
          parent={this.el.current}
          targetWidth={this.props.width}
          targetHeight={this.props.height}
          {...this.props}
        />
      );
    }
    return (
      <div ref={this.el} className={this.props.type} style={style}>
        {cropper}
      </div>
    );
  }
}

module.exports = ImageBlock;
