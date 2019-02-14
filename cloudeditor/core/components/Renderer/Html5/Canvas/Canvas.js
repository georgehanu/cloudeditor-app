const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const PropTypes = require("prop-types");
const { DragDropContextProvider } = require("react-dnd");
const HTML5Backend = require("react-dnd-html5-backend");

const Zoom = require("../Zoom/Zoom");

require("./Canvas.css");

const {
  groupsSelector
} = require("../../../../stores/selectors/Html5Renderer");
const { facingPagesSelector } = require("../../../../stores/selectors/project");
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
      const pages = this.props.groups.map(group => {
        if (group.indexOf(this.props.activePageId) > -1)
          return group.map(pageKey => {
            const classes = [
              "pageName",
              pageKey === this.props.activePageId ? "isActive" : ""
            ].join(" ");
            return (
              <div key={pageKey} className={classes}>
                <div>{this.props.labels[pageKey]["longLabel"]}</div>
              </div>
            );
          });
      });

      pageNumbers = <div className={"pageNameContainer"}>{pages}</div>;
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
    if (bottomContainer === undefined) return null;
    let leftSide = null;
    if (this.props.activePage.prevGroup)
      leftSide = (
        <div className={"sidePaginationItem sidePaginationItemLeft"}>
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

    if (this.props.activePage.nextGroup)
      rightSide = (
        <div className={"sidePaginationItem sidePaginationItemRight"}>
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
    // console.log(
    //   "renderlive renderPageContainer renderCanvas",
    //   this.props.zoomScale
    // );
    const { getCanvasRef, ...otherProps } = this.props;
    const pageNumbers = this.getPageNumbersRender();
    let bottomPagination = this.getBottomPagination();
    let sidePagination = this.getSidePagination();

    return (
      <div className="canvasContainer" ref={getCanvasRef}>
        <Zoom {...otherProps} onChangePage={this.onClickChangePageHandler} />
        {pageNumbers}
        {bottomPagination}
        {sidePagination}
      </div>
    );
  }
}
Canvas.propTypes = {
  visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  getCanvasRef: PropTypes.func,
  getContainerRef: PropTypes.func,
  activePage: PropTypes.object,
  zoomScale: PropTypes.number,
  pageReady: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

Canvas.defaultProps = {
  visible: 1,
  viewOnly: 0,
  getCanvasRef: () => {},
  getContainerRef: () => {},
  activePage: {},
  zoomScale: 1,
  pageReady: false
};
const mapStateToProps = (state, props) => {
  const getGroupsSelector = groupsSelector(facingPagesSelector);
  return {
    groups: getGroupsSelector(state)
  };
};

const CanvasComponent = hot(module)(
  connect(
    mapStateToProps,
    null
  )(Canvas)
);
module.exports = CanvasComponent;
