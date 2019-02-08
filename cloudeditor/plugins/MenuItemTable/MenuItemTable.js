const React = require("react");
const assign = require("object-assign");
const ProjectMenuButton = require("../ProjectMenu/components/ProjectMenuButton");
const { connect } = require("react-redux");
const { addTable } = require("../../core/stores/actions/project");
const uuidv4 = require("uuid/v4");

const { withNamespaces } = require("react-i18next");
const {
  pageColumnsNoSelector,
  pagesSelector,
  activePageIdSelector
} = require("../../core/stores/selectors/project");

class MenuItemTable extends React.Component {
  render() {
    const pageWidth = this.props.pages[this.props.activePageId].width;
    const columnsNo = this.props.columnsNo;
    const tableWidth = columnsNo > 0 ? pageWidth / columnsNo : pageWidth;

    return (
      <div className="projectMenuButtonLink">
        <ProjectMenuButton
          active={this.props.active}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
          clicked={() => {
            this.props.addTable({
              type: "tinymceTable",
              subType: "tinymceTable",
              left: 17,
              top: 17,
              id: uuidv4(),
              width: tableWidth,
              height: tableWidth
            });
          }}
        >
          {this.props.t(this.props.text)}
        </ProjectMenuButton>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    columnsNo: pageColumnsNoSelector(state),
    pages: pagesSelector(state),
    activePageId: activePageIdSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return { addTable: payload => dispatch(addTable(payload)) };
};

const MenuItemTablePlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemTable")(MenuItemTable));

module.exports = {
  MenuItemTable: assign(MenuItemTablePlugin, {
    ProjectMenu: {
      position: 7,
      priority: 1,
      text: "Table insert",
      embedButtonPlugin: true,
      menuItemClass: "buttonMenuItemTable"
    }
  })
};
