const React = require("react");
const assign = require("object-assign");
const { connect } = require("react-redux");

const { withNamespaces } = require("react-i18next");
const SubmenuText = require("./components/SubmenuData/SubmenuText");
const SubmenuImage = require("./components/SubmenuData/SubmenuImage");
const ImportType = require("./components/ImportComponents/ImportType");
const { addObjectMiddle } = require("../../core/stores/actions/project");
const {
  getDisplayedPageBlockActions
} = require("../../core/stores/selectors/Html5Renderer");

require("./MenuItemTextImage.css");
class MenuItemTextImage extends React.Component {
  state = {
    showModalImport: false,
    isFavourite: false,
    isText: true
  };

  showModalImportHandler = (isFavourite, isText) => {
    this.setState({ showModalImport: true, isFavourite, isText });
    this.props.onSetSubWndHandler(true);
  };
  closeModalImportHandler = () => {
    this.setState({ showModalImport: false });
    this.props.onSetSubWndHandler(false);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.active === false)
      return {
        showModalImport: false,
        isFavourite: false,
        isText: true
      };
    return prevState;
  }
  onClickAddBlock = params => {
    this.props.onClickAddBlockHandler(params);
  };

  render() {
    return (
      <div className="menuItemTextImageContainer projectMenuItem">
        {this.state.showModalImport && (
          <ImportType
            closeModal={this.closeModalImportHandler}
            isFavourite={this.state.isFavourite}
            isText={this.state.isText}
            onAddBlock={this.onClickAddBlock}
          />
        )}
        <div className="projectMenuItemHeader" />
        <div className="projectMenuItemContent">
          <SubmenuText
            onAddBlock={this.onClickAddBlock}
            showModalImportHandler={this.showModalImportHandler}
            blockActions={this.props.blockActions}
          />
          <SubmenuImage
            onAddBlock={this.onClickAddBlock}
            showModalImportHandler={this.showModalImportHandler}
            blockActions={this.props.blockActions}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    blockActions: getDisplayedPageBlockActions(state, props)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onClickAddBlockHandler: payload => dispatch(addObjectMiddle(payload))
  };
};

const MenuItemTextImagePlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemTextImage")(MenuItemTextImage));

module.exports = {
  MenuItemTextImage: assign(MenuItemTextImagePlugin, {
    ProjectMenu: {
      position: 3,
      priority: 1,
      text: "Text/Image insert"
    }
  })
};
