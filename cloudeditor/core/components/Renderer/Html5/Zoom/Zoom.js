const React = require("react");
const PropTypes = require("prop-types");
const randomColor = require("randomcolor");

require("./Zoom.css");

const Page = require("../Page/Page");

const applyZoom = ({ scale, zoom, width, height, canvasRef }) => {
  const zoomScale = scale + ((zoom * 100 - 100) / 100) * scale;
  const canvasRefBounding = canvasRef.getBoundingClientRect();
  const widthScale = width * zoomScale;
  const heightScale = height * zoomScale;
  const marginTop = !(heightScale > canvasRefBounding.height)
    ? (canvasRefBounding.height - heightScale) / 2
    : 0;
  const marginLeft = !(widthScale > canvasRefBounding.width)
    ? (canvasRefBounding.width - widthScale) / 2
    : 0;

  return {
    zoomScale,
    width: widthScale,
    height: heightScale,
    marginLeft,
    marginTop
  };
};

class Zoom extends React.Component {
  render() {
    const styleZoom = {
      backgroundColor: randomColor()
    };
    const { zoom, scale, viewOnly, width, height } = this.props;
    const classes = ["zoomContainer", zoom > 1 ? "zoomActive" : ""].join(" ");
    const zoomProps = applyZoom(this.props);

    return (
      <div style={styleZoom} className={classes}>
        <Page {...this.props} {...zoomProps} />
      </div>
    );
  }
}
Zoom.propTypes = {
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  zoom: PropTypes.number,
  canvasRef: PropTypes.object
};

Zoom.defaultProps = {
  viewOnly: 0,
  zoom: 1,
  canvasRef: {}
};

module.exports = Zoom;
