const React = require("react");
const assign = require("object-assign");
const { hot } = require("react-hot-loader");
const { connect } = require("react-redux");
const PropTypes = require("prop-types");
const randomColor = require("randomcolor");

require("./LiveHtml5Pagination.css");

const PageContainer = require("./components/PageContainer/PageContainer");
const { changeRandomPage } = require("../../stores/actions/project");

const { groupsSelector } = require("../../stores/selectors/Html5Renderer");

class LiveHtml5Pagination extends React.Component {
  renderGroups() {
    const groups = this.props.groups;
    groups.map({});
  }
  render() {
    const { groups, className, mode } = this.props;
    let groupContainer = groups.map(group => {
      const groupLength = group.length;
      return group.map((page, index) => {
        let className = ["paginationPage", mode];
        if (groupLength === 1) {
          className = className.concat(["left"]);
        } else {
          if (index === 0) className = className.concat(["left"]);
          if (index === groupLength - 1)
            className = className.concat(["right"]);
          if (index > 0 && index < groupLength - 1)
            className = className.concat(["center"]);
        }

        const classes = className.join(" ");
        return (
          <PageContainer
            classes={classes}
            page_id={page}
            key={page}
            mode={mode}
          >
            {page}
          </PageContainer>
        );
      });
    });

    return (
      <div className={className}>
        {groupContainer}{" "}
        <button onClick={this.props.onClickHandler}>change something</button>
      </div>
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
    groups: groupsSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onClickHandler: () => dispatch(changeRandomPage())
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
