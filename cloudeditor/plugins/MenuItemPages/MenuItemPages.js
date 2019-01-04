const React = require("react");
const assign = require("object-assign");
const { connect } = require("react-redux");

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

const pagesLabelSelector = createSelector(
  pagesOrderSelector,
  pagesSelector,
  (pagesOrder, pages) => {
    let pageNumber = 1;
    let pagesLabel = [];
    for (let index in pagesOrder) {
      const pageId = pagesOrder[index];
      pagesLabel.push({
        longLabel: pages[pageId]["label"].replace("%no%", pageNumber),
        page_id: pagesOrder[index]
      });
      pageNumber++;
    }
    return pagesLabel;
  }
);

class MenuItemPages extends React.Component {
  pageSelect = (page_id, index) => {
    if (this.props.previewEnabeld) {
      this.props.previewLoadPage(index);
    } else {
      this.props.onChangePageHandler({ page_id });
    }
  };
  render() {
    const pages = this.props.pagesLabel.map((el, index) => {
      return (
        <li
          key={index}
          className="submenuItem"
          onClick={() => this.pageSelect(el.page_id, index)}
        >
          {el.longLabel}
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
    pagesLabel: pagesLabelSelector(state),
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
      text: "Pages",
      tooltip: { title: "Fupa", description: "Fupa.net" }
    }
  })
};
