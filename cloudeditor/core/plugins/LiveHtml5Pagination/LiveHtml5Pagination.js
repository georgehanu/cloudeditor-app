const React = require("react");
const uuidv4 = require("uuid/v4");
const assign = require("object-assign");
const { hot } = require("react-hot-loader");
const { connect } = require("react-redux");
const PropTypes = require("prop-types");
const PageHeader = require("./components/PageHeader/PageHeader");
const { clone } = require("ramda");

require("./LiveHtml5Pagination.css");

const PageContainer = require("./components/PageContainer/PageContainer");
const {
  changeRandomPage,
  changePagesOrder,
  addPages
} = require("../../stores/actions/project");

const { groupsSelector } = require("../../stores/selectors/Html5Renderer");
const {
  pagesOrderSelector,
  activePageIdSelector,
  groupSizeSelector,
  facingPagesSelector
} = require("../../stores/selectors/project");
const { rerenderPage } = require("../../../core/utils/UtilUtils");
const AddPages = require("./components/AddPages/AddPages");

class LiveHtml5Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "minimized",
      hoverId: null,
      showAddPages: false,
      nrPagesToInsert: props.groupSize,
      location: "after",
      uuid: uuidv4()
    };
  }
  renderGroups() {
    const groups = this.props.groups;
    groups.map({});
  }
  highlightHoverPage = hoverId => {
    this.setState({ hoverId });
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
    this.props.onChangePagesOrderHandler({
      pages: newPages,
      page_id: from
    });
  };
  minimize = () => {
    if (this.state.size === "normal") {
      this.setState({ size: "minimized" }, () => {
        this.props.addContainerClasses(
          "PageSelector",
          ["pageSelectorMinimized"],
          true
        );
      });
    } else {
      this.setState({ size: "normal" }, () => {
        this.props.addContainerClasses(
          "PageSelector",
          ["pageSelectorNormal"],
          true
        );
      });
    }
  };
  extend = () => {
    if (this.state.size === "normal") {
      this.setState({ size: "extended" }, () => {
        this.props.addContainerClasses(
          "PageSelector",
          ["pageSelectorExtended"],
          true
        );
      });
    } else {
      this.setState({ size: "normal" }, () => {
        this.props.addContainerClasses(
          "PageSelector",
          ["pageSelectorNormal"],
          true
        );
      });
    }
  };
  showAddPages = () => {
    this.setState({ showAddPages: true });
  };
  hideAddPages = () => {
    this.setState({ showAddPages: false });
  };
  onCheckboxChanged = value => {
    this.setState({ location: value });
  };
  addPages = () => {
    const { nrPagesToInsert, location } = this.state;
    this.props.onAddPagesHandler({ nrPagesToInsert, location });
    this.setState({ showAddPages: false });
  };
  changePagesToInsert = event => {
    this.setState({ nrPagesToInsert: event.target.value });
  };
  render() {
    const { groups, className, mode } = this.props;
    let groupContainer = groups.map(group => {
      const groupLength = group.length;
      return group.map((page, index) => {
        let className = [
          "paginationPage",
          mode,
          "singlePageContainer",
          page === this.props.activePageId ? " singlePageSelected" : "",
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
            group={group}
            classes={classes}
            page_id={page}
            key={page}
            mode1={mode}
            hoverId={page}
            selectedId={page}
            mode={this.state.size}
            includeBoxes={1}
            useMagentic={0}
            switchPages={this.switchPages}
            highlightHoverPage={this.highlightHoverPage}
            uuid={this.state.uuid}
          >
            {page}
          </PageContainer>
        );
      });
    });

    return (
      <React.Fragment>
        {this.state.showAddPages && (
          <AddPages
            show={true}
            hideAddPages={this.hideAddPages}
            changePagesToInsert={this.changePagesToInsert}
            nrPagesToInsert={this.state.nrPagesToInsert}
            addPages={this.addPages}
            onCheckboxChanged={this.onCheckboxChanged}
          />
        )}

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
      </React.Fragment>
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
  const getGroupsSelector = groupsSelector(facingPagesSelector);
  return {
    groups: getGroupsSelector(state),
    pagesOrder: pagesOrderSelector(state),
    activePageId: activePageIdSelector(state),
    groupSize: groupSizeSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onClickHandler: () => dispatch(changeRandomPage()),
    onChangePagesOrderHandler: payload => dispatch(changePagesOrder(payload)),
    onAddPagesHandler: payload => dispatch(addPages(payload))
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
