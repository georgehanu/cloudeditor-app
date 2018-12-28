const React = require("react");
const assign = require("object-assign");
const { connect } = require("react-redux");

const { withNamespaces } = require("react-i18next");
const SubmenuText = require("./components/SubmenuData/SubmenuText");
const SubmenuImage = require("./components/SubmenuData/SubmenuImage");
const ImportType = require("./components/ImportComponents/ImportType");

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

  render() {
    return (
      <div className="menuItemTextImageContainer projectMenuItem">
        {this.state.showModalImport && (
          <ImportType
            closeModal={this.closeModalImportHandler}
            isFavourite={this.state.isFavourite}
            isText={this.state.isText}
          />
        )}
        <div className="projectMenuItemHeader" />
        <div className="projectMenuItemContent">
          <SubmenuText showModalImportHandler={this.showModalImportHandler} />
          <SubmenuImage showModalImportHandler={this.showModalImportHandler} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    //pagesLabel: pagesLabelSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //onChangePageHandler: payload => dispatch(changePage(payload))
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
