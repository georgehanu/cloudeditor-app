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
    let {
      containerHeight,
      containerWidth,
      zoomScale,
      viewOnly,
      bottomContainer
    } = this.props;
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
      top: bottomContainer,
      left: margins.marginLeft
    };
    const { getCanvasRef, ...otherProps } = this.props;
    let pageNumbers = null;

    if (!viewOnly) {
      const innerPages = this.props.activePage.innerPages;
      const pages = Object.keys(innerPages).map(pageKey => {
        const pageNameStyle = {
          left:
            (innerPages[pageKey]["offset"]["left"] +
              this.props.activePage.offset.left) *
            this.props.zoomScale,
          width:
            (innerPages[pageKey]["width"] + this.props.activePage.offset.left) *
            this.props.zoomScale
        };
        const classes = [
          "pageName",
          pageKey === this.props.activePageId ? "isActive" : ""
        ].join(" ");
        return (
          <div key={pageKey} className={classes} style={pageNameStyle}>
            <div>{this.props.labels[pageKey]["longLabel"]}</div>
          </div>
        );
      });
      pageNumbers = (
        <div style={pageNamesStyle} className={"pageNameContainer"}>
          {pages}
        </div>
      );
    }
    let nextPageHandler = null;
    if (this.props.activePage.nextPage) {
      nextPageHandler = (
        <div
          className={"paginationItem"}
          onClick={() => {
            this.props.onChangePage({
              page_id: this.props.activePage.nextPage
            });
          }}
        >
          <span className={"icon printqicon-nextarrow"} />
        </div>
      );
    }
    let prevPageHandler = null;
    if (this.props.activePage.prevPage) {
      prevPageHandler = (
        <div
          className={"paginationItem"}
          onClick={() => {
            this.props.onChangePage({
              page_id: this.props.activePage.prevPage
            });
          }}
        >
          <span className={"icon printqicon-backarrow "} />
        </div>
      );
    }
    return (
      <div className="canvasContainer" ref={getCanvasRef}>
        <Zoom {...otherProps} />
        {pageNumbers}
        <div className={"paginationBottomContainer"}>
          <div className="previousContainer paginationSubContainer">
            {prevPageHandler}
          </div>
          <div className="nextContainer paginationSubContainer">
            {nextPageHandler}
          </div>
        </div>
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
