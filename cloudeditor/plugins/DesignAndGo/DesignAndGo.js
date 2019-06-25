const React = require("react");
const Layout = require("./components/DesignAndGoItems/LayoutItems/Layout");
const { connect } = require("react-redux");

require("slick-carousel/slick/slick.css");
require("slick-carousel/slick/slick-theme.css");

const { withNamespaces } = require("react-i18next");
const MenuModal = require("./components/DesignAndGoItems/UI/MenuModal");
const MenuDataModal = require("./components/DesignAndGoItems/UI/MenuDataModal");
const SignInModal = require("./components/DesignAndGoItems/UI/SignInModal");
const CropImageModal = require("./components/DesignAndGoItems/CropImage/CropImageModal");
const ZoomImageModal = require("./components/DesignAndGoItems/ZoomImage/ZoomImageModal");

const SaveWnd = require("./components/SaveLoadItems/SaveWnd");
const LoadWnd = require("./components/SaveLoadItems/LoadWnd");

const assign = require("object-assign");
const { dagImageSelection } = require("../../core/stores/selectors/project");
const { updateObjectProps } = require("../../core/stores/actions/project");
const {
  variablesVariablesSelector
} = require("../../core/stores/selectors/variables");

class DesignAndGo extends React.Component {
  state = {
    menuOpened: false,
    dataOpened: false,
    signInOpened: false,
    cropImageModalOpened: false,
    zoomImageModalOpened: false,
    showLoginWnd: false,
    showSaveWnd: false,
    showRegisterWnd: false,
    showLoadWnd: false
  };

  getLayoutPlugins = () => {
    return this.props.items
      .filter(item => {
        return item.target === "Layout";
      })
      .map(item => {
        item.addContainerClasses = this.props.addContainerClasses;
        return item;
      })
      .sort((a, b) => a.position - b.position);
  };

  onMenuCloseHandler = () => {
    this.setState({
      menuOpened: false,
      dataOpened: false,
      signInOpened: false,
      cropImageModalOpened: false,
      zoomImageModalOpened: false
    });
  };
  onMenuOpenHandler = () => {
    this.setState({ menuOpened: true });
  };
  onDataOpenHandler = () => {
    this.setState({ dataOpened: true });
  };
  onSignInOpenHandler = () => {
    this.setState({ menuOpened: false, signInOpened: true });
  };
  onCropImageModalOpenHandler = () => {
    this.setState({ cropImageModalOpened: true });
  };
  onZoomImageModalOpenedHandler = () => {
    this.setState({ zoomImageModalOpened: true });
  };

  onCropImageHandler = cropInfo => {
    // this.refs.cropper.getCroppedCanvas().toDataURL();
    this.props.onUpdatePropsHandler({
      id: this.props.image.id,
      props: { ...cropInfo }
    });

    this.onMenuCloseHandler();
  };

  onClickDebug = () => {
    toggleContainer();
  };

  closeWnd = () => {
    this.setState({
      showLoginWnd: false,
      showSaveWnd: false,
      showLoadWnd: false,
      showRegisterWnd: false
    });
    //this.props.onSetSubWndHandler(false);
  };

  showSaveWnd = () => {
    this.setState({ showSaveWnd: true });
    //this.props.onSetSubWndHandler(true);
  };

  showLoadWnd = () => {
    this.setState({ showLoadWnd: true });
    //this.props.onSetSubWndHandler(true);
  };

  render() {
    return (
      <React.Fragment>
        {this.state.showSaveWnd && (
          <SaveWnd show={true} modalClosed={this.closeWnd} />
        )}
        {this.state.showLoadWnd && (
          <LoadWnd show={true} modalClosed={this.closeWnd} />
        )}
        <div className="DesignAndGo cloudeditor">
          <div className="DesignAndGoMenu">
            {this.state.menuOpened && (
              <MenuModal
                show={this.state.menuOpened}
                modalClosed={this.onMenuCloseHandler}
                onSignInOpenHandler={this.onSignInOpenHandler}
                onSaveProjectOpenHandler={this.showSaveWnd}
                onLoadProjectOpenHandler={this.showLoadWnd}
              />
            )}
            {this.state.dataOpened && (
              <MenuDataModal
                show={this.state.dataOpened}
                modalClosed={this.onMenuCloseHandler}
              />
            )}
          </div>
          {this.state.signInOpened && (
            <SignInModal
              show={this.state.signInOpened}
              modalClosed={this.onMenuCloseHandler}
            />
          )}
          {this.state.cropImageModalOpened && (
            <CropImageModal
              modalClosed={this.onMenuCloseHandler}
              image={this.props.image}
              onCropImageHandler={this.onCropImageHandler}
              variables={this.props.variables}
            />
          )}
          {this.state.zoomImageModalOpened && (
            <ZoomImageModal
              show={this.state.zoomImageModalOpened}
              modalClosed={this.onMenuCloseHandler}
            />
          )}

          <Layout
            addContainerClasses={this.props.addContainerClasses}
            tools={this.getLayoutPlugins()}
            onMenuOpenHandler={this.onMenuOpenHandler}
            onDataOpenHandler={this.onDataOpenHandler}
            onCropImageModalOpenHandler={this.onCropImageModalOpenHandler}
            onZoomImageHandler={this.onZoomImageModalOpenedHandler}
          />
          <div id="debugButton" onClick={this.onClickDebug}>
            Debug
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    image: dagImageSelection(state),
    variables: variablesVariablesSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdatePropsHandler: payload => dispatch(updateObjectProps(payload))
  };
};

const DesignAndGoPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("designAndGo")(DesignAndGo));

module.exports = {
  DesignAndGo: assign(DesignAndGoPlugin),
  reducers: {
    designAndGo: require("./store/reducers/general")
  },
  epics: require("./store/epics")
};
