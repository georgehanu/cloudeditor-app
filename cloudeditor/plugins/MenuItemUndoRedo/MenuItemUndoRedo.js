const React = require("react");
const assign = require("object-assign");
const { connect } = require("react-redux");
const { actions } = require("@intactile/redux-undo-redo");

const { withNamespaces } = require("react-i18next");

class MenuItemUndoRedo extends React.Component {
  render() {
    return (
      <div className="menuItemUndoRedoContainer projectMenuItem">
        <div className="projectMenuItemHeader" />
        <div className="projectMenuItemContent">
          <ul>
            <li onClick={this.props.onUndo} key={0} className="submenuItem">
              {this.props.t("Undo")}
            </li>
            <li onClick={this.props.onRedo} key={1} className="submenuItem">
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

const mapDispatchToProps = {
  onUndo: actions.undo,
  onRedo: actions.redo
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
