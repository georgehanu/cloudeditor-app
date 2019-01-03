const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const PropTypes = require("prop-types");
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
  onClickChangePageHandler = page_id => {
    this.props.onChangePage({
      page_id
    });
  };
  getPageNumbersRender = () => {
    let { width, height } = this.props.activePage;
    let {
      containerHeight,
      containerWidth,
      viewOnly,
      zoomScale,
      bottomContainer
    } = this.props;
    if (bottomContainer === undefined) return null;
    width *= zoomScale;
    height *= zoomScale;
    const margins = centerPage({
      width,
      height,
      containerWidth,
      containerHeight
    });
    const pageNamesStyle = {
      top: bottomContainer - margins.marginTop,
      left: margins.marginLeft
    };

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
    return pageNumbers;
  };
  getBottomPagination = () => {
    const { viewOnly } = this.props;
    if (viewOnly) return null;
    let nextPageHandler = null;
    if (this.props.activePage.nextPage) {
      nextPageHandler = (
        <div
          className={"paginationItem"}
          onClick={() => {
            this.onClickChangePageHandler(this.props.activePage.nextPage);
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
            this.onClickChangePageHandler(this.props.activePage.prevPage);
          }}
        >
          <span className={"icon printqicon-backarrow "} />
        </div>
      );
    }
    return (
      <div className={"paginationBottomContainer"}>
        <div className="previousContainer paginationSubContainer">
          {prevPageHandler}
        </div>
        <div className="nextContainer paginationSubContainer">
          {nextPageHandler}
        </div>
      </div>
    );
  };
  getSidePagination = () => {
    let { width, height } = this.props.activePage;
    let {
      containerHeight,
      containerWidth,
      viewOnly,
      zoomScale,
      bottomContainer
    } = this.props;
    width *= zoomScale;
    height *= zoomScale;
    const margins = centerPage({
      width,
      height,
      containerWidth,
      containerHeight
    });
    if (bottomContainer === undefined) return null;
    const leftStyle = {
      top:
        bottomContainer -
        margins.marginTop -
        (containerHeight - margins.marginTop * 2) / 2,
      left: margins.marginLeft
    };
    if (viewOnly) return null;
    let leftSide = null;
    if (this.props.activePage.prevGroup)
      leftSide = (
        <div
          style={leftStyle}
          className={"sidePaginationItem sidePaginationItemLeft"}
        >
          <div
            className={"sidePaginationSubItem"}
            onClick={() => {
              this.onClickChangePageHandler(this.props.activePage.prevGroup);
            }}
          >
            <span className={"icon printqicon-backarrow "} />
          </div>
        </div>
      );
    let rightSide = null;
    const rightStyle = {
      top:
        bottomContainer -
        margins.marginTop -
        (containerHeight - margins.marginTop * 2) / 2,
      left: margins.marginLeft + (containerWidth - margins.marginLeft * 2)
    };
    if (this.props.activePage.nextGroup)
      rightSide = (
        <div
          style={rightStyle}
          className={"sidePaginationItem sidePaginationItemRight"}
        >
          <div
            className={"sidePaginationSubItem"}
            onClick={() => {
              this.onClickChangePageHandler(this.props.activePage.nextGroup);
            }}
          >
            <span className={"icon printqicon-nextarrow "} />
          </div>
        </div>
      );
    return (
      <React.Fragment>
        {leftSide}
        {rightSide}
      </React.Fragment>
    );
  };
  render() {
    const { getCanvasRef, ...otherProps } = this.props;
    const pageNumbers = this.getPageNumbersRender();
    let bottomPagination = this.getBottomPagination();
    let sidePagination = this.getSidePagination();
    return (
      <div className="canvasContainer" ref={getCanvasRef}>
        <Zoom {...otherProps} />
        {pageNumbers}
        {bottomPagination}
        {sidePagination}
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
