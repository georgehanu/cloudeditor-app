const React = require("react");
const assign = require("object-assign");
const { connect } = require("react-redux");

const { withNamespaces } = require("react-i18next");

class MenuItemUndoRedo extends React.Component {
  render() {
    return (
      <div className="menuItemUndoRedoContainer projectMenuItem">
        <div className="projectMenuItemHeader" />
        <div className="projectMenuItemContent">
          <ul>
            <li key={0} className="submenuItem">
              {this.props.t("Undo")}
            </li>
            <li key={1} className="submenuItem">
              {this.props.t("Redo")}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

const MenuItemUndoRedoPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemUndoRedo")(MenuItemUndoRedo));

module.exports = {
  MenuItemUndoRedo: assign(MenuItemUndoRedoPlugin, {
    ProjectMenu: {
      position: 3,
      priority: 1,
      text: "Edit action",
      menuItemClass: "menuItemUndoRedo"
    }
  })
};
