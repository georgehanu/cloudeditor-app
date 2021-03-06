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
    const pageHeight = this.props.pages[this.props.activePageId].height;
    const columnsNo = this.props.columnsNo;
    const tableWidth = pageWidth / 2; //columnsNo > 0 ? pageWidth / columnsNo : pageWidth;
    const left = (pageWidth - tableWidth) / 2;
    const top = (pageHeight - tableWidth) / 2;
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
              left,
              top,
              id: uuidv4(),
              width: tableWidth,
              height: tableWidth,
              tableContent:
                '<table class="dummyTable" style="font-size:15px;text-align:center"><tbody><tr><td>' +
                this.props.t("Paste Your Table Here") +
                "</td></tr></tbody></table>"
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
      position: 6,
      priority: 1,
      text: "Table insert",
      embedButtonPlugin: true,
      menuItemClass: "buttonMenuItemTable"
    }
  })
};
