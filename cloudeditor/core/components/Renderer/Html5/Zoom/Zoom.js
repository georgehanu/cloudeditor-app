const React = require("react");
const PropTypes = require("prop-types");
const { hot } = require("react-hot-loader");
const { connect } = require("react-redux");
const { pathOr, without } = require("ramda");

const {
  groupsSelector
} = require("../../../../stores/selectors/Html5Renderer");
const { facingPagesSelector } = require("../../../../stores/selectors/project");
const {
  createDeepEqualSelector: createSelector
} = require("../../../../../core/rewrites/reselect/createSelector");

const {
  displayedPageSelector
} = require("../../../../../core/stores/selectors/Html5Renderer");

require("./Zoom.css");
const Page = require("../Page/Page");
class Zoom extends React.Component {
  onScrollHandler = event => {
    const scrollLeft = event.target.scrollLeft;
    let internalPagination = document.getElementsByClassName(
      "pageNameContainer"
    );
    if (internalPagination.length) {
      internalPagination[0].scrollTo(scrollLeft, 0);
    }
  };
  componentDidUpdate() {
    this.updateSidePagination();
  }
  updateSidePagination = () => {
    const pageContainers = document.querySelectorAll(
      ".renderContainer .pageContainer.page"
    );
    const zoomContainer = document.querySelector(
      ".renderContainer .zoomContainer "
    );
    const pageNameContainer = document.querySelector(
      ".renderContainer .pageNameContainer "
    );
    const secondZoom = document.querySelector(".renderContainer .secondZoom ");
    const rightPagination = document.querySelectorAll(
      ".sidePaginationItem.sidePaginationItemRight"
    );
    const pageName = document.querySelectorAll(
      ".renderContainer .pageNameContainer .pageName"
    );
    const leftPagination = document.querySelectorAll(
      ".sidePaginationItem.sidePaginationItemLeft"
    );
    if (!pageContainers.length) return null;
    const lastElement = pageContainers[pageContainers.length - 1];
    const firstElement = pageContainers[0];
    const boundingFirst = firstElement.getBoundingClientRect();
    const boundingLast = lastElement.getBoundingClientRect();
    if (rightPagination.length)
      rightPagination[0].style.left = boundingLast.right + "px";
    if (leftPagination.length)
      leftPagination[0].style.left = boundingFirst.left + "px";
    let width = 0;
    pageContainers.forEach((element, key) => {
      width += element.scrollWidth;
      if (pageName[key]) {
        pageName[key].style.left = element.getBoundingClientRect().left + "px";
        pageName[key].style.width =
          element.getBoundingClientRect().width + "px";
      }
    });
    if (pageNameContainer) {
      const boundingZoom = zoomContainer.getBoundingClientRect();
      pageNameContainer.style.top = boundingZoom.bottom + "px";
    }
    if (secondZoom) {
      secondZoom.style.width = "100%";
    }
    if (width > zoomContainer.offsetWidth) {
      if (secondZoom) {
        secondZoom.style.width = width + "px";
      }
    }
  };
  render() {
    const { getContainerRef, pageReady, zoom } = this.props;
    const classes = ["zoomContainer", zoom > 1 ? "zoomActive" : ""].join(" ");
    let index = 0;
    let pageContainer = null;
    if (pageReady) {
      if (!this.props.viewOnly) {
        pageContainer = this.props.groups.map(group => {
          if (group.indexOf(this.props.activePageId) > -1)
            if (group.length > 1) {
              return group.map(page_id => {
                let page = null;
                if (this.props.activePageId !== page_id) {
                  page = (
                    <Page
                      key={page_id}
                      {...this.props}
                      activePage={this.props.groupedPages[page_id]}
                      activePageId={page_id}
                      viewOnly={1}
                      containerWidth={this.props.containerWidth / 2}
                    />
                  );
                } else {
                  page = <Page key={page_id} {...this.props} />;
                }
                const classNames = [
                  "page_wrapper",
                  this.props.activePageId !== page_id ? "overlay" : "no_overlay"
                ].join(" ");
                return (
                  <div
                    key={page_id}
                    ref={getContainerRef}
                    className={classNames}
                    style={{ width: "50%" }}
                  >
                    {page}
                  </div>
                );
              });
            } else {
              return <Page key={"group_" + index++} {...this.props} />;
            }
          return null;
        });
      } else {
        pageContainer = <Page {...this.props} />;
      }
    }
    return (
      <div
        ref={getContainerRef}
        className={classes}
        onScroll={this.onScrollHandler}
      >
        <div className={"secondZoom"}>{pageContainer}</div>
      </div>
    );
  }
}
Zoom.propTypes = {
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

Zoom.defaultProps = {
  viewOnly: 0
};
const mapStateToProps = (state, props) => {
  const activePage = (state, props) => {
    return state.project.activePage;
  };

  const getGroupsSelector = groupsSelector(facingPagesSelector);

  const includeBoxesSelector = state => {
    return pathOr(
      false,
      ["project", "configs", "document", "includeBoxes"],
      state
    );
  };
  const allowSafeCutSelector = state => {
    return pathOr(
      false,
      ["project", "configs", "document", "allowSafeCut"],
      state
    );
  };
  const singlePageSelector = state => {
    return 1;
  };

  const getGroupPages = createSelector(
    [getGroupsSelector, activePage],
    (groups, activePageId) => {
      let groupedPages = {};
      groups.map(group => {
        if (group.indexOf(activePageId) > -1)
          group.map(page_id => {
            const groupSelector = (state, props) => {
              return [page_id];
            };
            const activePage = (_, props) => {
              return page_id;
            };
            const x = displayedPageSelector(
              singlePageSelector,
              groupSelector,
              activePage,
              includeBoxesSelector,
              allowSafeCutSelector
            );

            groupedPages[page_id] = x(state);
          });
      });
      return groupedPages;
    }
  );

  return {
    groups: getGroupsSelector(state),
    groupedPages: getGroupPages(state)
  };
};

module.exports = hot(module)(
  connect(
    mapStateToProps,
    null
  )(Zoom)
);
