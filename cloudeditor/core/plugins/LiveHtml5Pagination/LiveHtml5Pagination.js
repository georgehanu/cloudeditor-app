const React = require("react");
const assign = require("object-assign");
const { hot } = require("react-hot-loader");
const { connect } = require("react-redux");
const PropTypes = require("prop-types");
const randomColor = require("randomcolor");
const { DragDropContextProvider } = require("react-dnd");
const HTML5Backend = require("react-dnd-html5-backend");
const PageHeader = require("./components/PageHeader/PageHeader");
const { clone } = require("ramda");
const uuidv4 = require("uuid/v4");

require("./LiveHtml5Pagination.css");

const PageContainer = require("./components/PageContainer/PageContainer");
const {
  changeRandomPage,
  changePagesOrder
} = require("../../stores/actions/project");

const { groupsSelector } = require("../../stores/selectors/Html5Renderer");
const {
  pagesOrderSelector,
  activePageIdSelector
} = require("../../stores/selectors/project");
const { rerenderPage } = require("../../../core/utils/UtilUtils");
class LiveHtml5Pagination extends React.Component {
  state = {
    size: "minimized",
    hoverId: null
  };
  renderGroups() {
    const groups = this.props.groups;
    groups.map({});
  }
  highlightHoverPage = hoverId => {
    this.setState({ hoverId });
  };

  selectPage = (selectedId, addNewpage) => {
    /* if (addNewpage === true) {
      this.insertNewPages(1);
    } else {
      this.setState({ selectedId });
    } */
  };
  componentDidMount() {
    this.minimize();
  }
  switchPages = (from, to) => {
    if (from === to) {
      return;
    }
    const newPages = clone(this.props.pagesOrder);
    let fromIndex = this.props.pagesOrder.findIndex(el => {
      return el === from;
    });
    let toIndex = this.props.pagesOrder.findIndex(el => {
      return el === to;
    });
    newPages[fromIndex] = this.props.pagesOrder[toIndex];
    newPages[toIndex] = this.props.pagesOrder[fromIndex];
    this.props.onChangePagesOrder({ pages: newPages, page_id: from });
  };
  minimize = () => {
    if (this.state.size === "normal") {
      this.props.addContainerClasses("PageSelector", ["pageSelectorMinimized"]);
      this.setState({ size: "minimized" }, () => {
        rerenderPage();
      });
    } else {
      this.props.addContainerClasses("PageSelector", ["pageSelectorNormal"]);
      this.setState({ size: "normal" }, () => {
        rerenderPage();
      });
    }
  };
  extend = () => {
    if (this.state.size === "normal") {
      this.props.addContainerClasses("PageSelector", ["pageSelectorExtended"]);
      this.setState({ size: "extended" }, () => {
        rerenderPage();
      });
    } else {
      this.props.addContainerClasses("PageSelector", ["pageSelectorNormal"]);
      this.setState({ size: "normal" }, () => {
        rerenderPage();
      });
    }
  };
  render() {
    const { groups, className, mode } = this.props;
    const page_number = 1;
    let groupContainer = groups.map(group => {
      const groupLength = group.length;
      return group.map((page, index) => {
        let className = [
          "paginationPage",
          mode,
          "singlePageContainer",
          page == this.props.activePageId ? " singlePageSelected" : "",
          this.state.hoverId === page ? " singlePageHover" : ""
        ];
        if (groupLength === 1) {
          className = className.concat(["singlePageLeft"]);
        } else {
          if (index === 0) className = className.concat(["singlePageLeft"]);
          if (index === groupLength - 1)
            className = className.concat(["singlePageRight"]);
          if (index > 0 && index < groupLength - 1)
            className = className.concat(["singlePageCenter"]);
        }

        const classes = className.join(" ");
        return (
          <PageContainer
            classes={classes}
            page_id={page}
            key={page}
            mode={mode}
            hoverId={page}
            selectedId={page}
            mode={this.state.size}
            switchPages={this.switchPages}
            selectPage={this.selectPage}
            highlightHoverPage={this.highlightHoverPage}
          >
            {page}
          </PageContainer>
        );
      });
    });

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="pageSelectorContainer">
          <div className="pageSelector">
            <PageHeader
              minimize={this.minimize}
              extend={this.extend}
              status={this.state.size}
              showExtend={this.state.size !== "extended"}
              showMinimized={this.state.size !== "minimized"}
              showAddPages={this.showAddPages}
            />
            <div className={className}>{groupContainer}</div>
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}

LiveHtml5Pagination.propTypes = {
  className: PropTypes.string,
  mode: PropTypes.string
};

LiveHtml5Pagination.defaultProps = {
  className: "html5LivePaginationContainer",
  mode: "normal"
};

const mapStateToProps = state => {
  return {
    groups: groupsSelector(state),
    pagesOrder: pagesOrderSelector(state),
    activePageId: activePageIdSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onClickHandler: () => dispatch(changeRandomPage()),
    onChangePagesOrder: payload => dispatch(changePagesOrder(payload))
  };
};
const LiveHtml5PaginationPlugin = hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LiveHtml5Pagination)
);
module.exports = {
  LiveHtml5Pagination: assign(LiveHtml5PaginationPlugin),
  reducers: {},
  epics: {}
};
