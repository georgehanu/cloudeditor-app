const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const PropTypes = require("prop-types");
const randomColor = require("randomcolor");
const { DragDropContextProvider } = require("react-dnd");
const HTML5Backend = require("react-dnd-html5-backend");

const Zoom = require("../Zoom/Zoom");

require("./Canvas.css");

const centerPage = ({ width, height, containerWidth, containerHeight }) => {
  const marginTop = !(height > containerHeight)
    ? (containerHeight - height) / 2
    : 0;
  const marginLeft = !(width > containerWidth)
    ? (containerWidth - width) / 2
    : 0;

  return {
    marginLeft,
    marginTop
  };
};
class Canvas extends React.Component {
  render() {
    let { containerHeight, containerWidth, zoomScale, viewOnly } = this.props;
    let { width, height } = this.props.activePage;
    width *= zoomScale;
    height *= zoomScale;
    const margins = centerPage({
      width,
      height,
      containerWidth,
      containerHeight
    });
    const pageNamesStyle = {
      width,
      left: margins.marginLeft
    };
    const { getCanvasRef, ...otherProps } = this.props;
    let pageNumbers = null;

    if (!viewOnly) {
      const innerPages = this.props.activePage.innerPages;
      const pages = Object.keys(innerPages).map(pageKey => {
        const pageNameStyle = {
          left: innerPages[pageKey]["offset"]["left"] * this.props.zoomScale
        };
        return (
          <div key={pageKey} className={"pageName"} style={pageNameStyle}>
            {this.props.labels[pageKey]["longLabel"]}
          </div>
        );
      });
      pageNumbers = (
        <div style={pageNamesStyle} className={"pageNameContainer"}>
          {pages}
        </div>
      );
    }
    return (
      <div className="canvasContainer" ref={getCanvasRef}>
        <Zoom {...otherProps} />
        {pageNumbers}
      </div>
    );
  }
}
Canvas.propTypes = {
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  getCanvasRef: PropTypes.func,
  getContainerRef: PropTypes.func,
  activePage: PropTypes.object,
  zoomScale: PropTypes.number,
  pageReady: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

Canvas.defaultProps = {
  viewOnly: 0,
  getCanvasRef: () => {},
  getContainerRef: () => {},
  activePage: {},
  zoomScale: 1,
  pageReady: false
};

const CanvasComponent = hot(module)(connect(null)(Canvas));
module.exports = CanvasComponent;
