const React = require("react");
const assign = require("object-assign");
const { connect } = require("react-redux");
const { forEachObjIndexed } = require("ramda");

const { withNamespaces } = require("react-i18next");
const {
  pagesOrderSelector,
  pagesSelector
} = require("../../core/stores/selectors/project");
const {
  createDeepEqualSelector: createSelector
} = require("../../core/rewrites/reselect/createSelector");
const { changePage } = require("../../core/stores/actions/project");

const { previewEnabeldSelector } = require("../PrintPreview/store/selectors");

const { previewLoadPage } = require("../PrintPreview/store/actions");

const {
  displayedPagesLabelsSelector
} = require("../../core/stores/selectors/Html5Renderer");
require("./MenuItemPages.css");
class MenuItemPages extends React.Component {
  pageSelect = (page_id, index) => {
    if (this.props.previewEnabeld) {
      this.props.previewLoadPage({ page_id });
    } else {
      this.props.onChangePageHandler({ page_id });
    }
  };
  render() {
    let index = 0;
    const pages = Object.keys(this.props.pagesLabel).map(obKey => {
      return (
        <li
          key={obKey}
          className="submenuItem"
          onClick={() => this.pageSelect(obKey, index++)}
        >
          {this.props.pagesLabel[obKey]["longLabel"]}
        </li>
      );
    });
    return (
      <div className="menuItemPagesContainer projectMenuItem">
        <div className="projectMenuItemHeader" />
        <div className="projectMenuItemContent">
          <ul>{pages}</ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    pagesLabel: displayedPagesLabelsSelector(state),
    previewEnabeld: previewEnabeldSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangePageHandler: payload => dispatch(changePage(payload)),
    previewLoadPage: pageNo => dispatch(previewLoadPage(pageNo))
  };
};

const MenuItemPagesPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemPages")(MenuItemPages));

module.exports = {
  MenuItemPages: assign(MenuItemPagesPlugin, {
    ProjectMenu: {
      position: 2,
      priority: 1,
      text: "Pages"
    }
  })
};
