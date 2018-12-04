const React = require("react");

const PropTypes = require("prop-types");
const randomColor = require("randomcolor");

require("./Zoom.css");
const Page = require("../Page/Page");

const centerPage = ({ width, height, canvasRef }) => {
  const canvasRefBounding = canvasRef.getBoundingClientRect();
  const marginTop = !(height > canvasRefBounding.height)
    ? (canvasRefBounding.height - height) / 2
    : 0;
  const marginLeft = !(width > canvasRefBounding.width)
    ? (canvasRefBounding.width - width) / 2
    : 0;

  return {
    marginLeft,
    marginTop
  };
};

class Zoom extends React.Component {
  render() {
    const styleZoom = {
      // backgroundColor: randomColor()
    };
    const { zoom } = this.props;
    const classes = ["zoomContainer", zoom > 1 ? "zoomActive" : ""].join(" ");
    const centeredProps = centerPage(this.props);

    return (
      <div style={styleZoom} className={classes}>
        <Page {...this.props} {...centeredProps} />
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
