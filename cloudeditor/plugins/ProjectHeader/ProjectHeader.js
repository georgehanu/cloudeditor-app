const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");
const isEqual = require("react-fast-compare");
const axios = require("axios");
const qs = require("qs");
const AddToCartButton = require("./components/AddToCartButton");
const ConfigUtils = require("../../core/utils/ConfigUtils");

const {
  titleSelector,
  getNumberOfPagesSelector,
  pagesOrderSelector,
  projProjectIdSelector
} = require("../../core/stores/selectors/project");
const {
  getProductNameSelector,
  getTotalPriceSelector,
  getQtySelector,
  getProductInformationSelector
} = require("../../core/stores/selectors/productinformation");
const {
  previewLoadPage,
  previewDisableMode,
  attachPreview
} = require("../PrintPreview/store/actions");
const {
  startGlobalLoading,
  stopGlobalLoading
} = require("../../core/stores/actions/globalLoading");
const {
  calculatePriceInitial
} = require("../../core/stores/actions/productInformation");

const { changePage } = require("../../core/stores/actions/project");

const LoginWnd = require("../MenuItemMyProject/components/LoginWnd");
const SaveWnd = require("../MenuItemMyProject/components/SaveWnd");
const RegisterWnd = require("../MenuItemMyProject/components/RegisterWnd");

const { authLoggedInSelector } = require("../ProjectMenu/store/selectors");

require("./ProjectHeader.css");
class ProjectHeader extends React.Component {
  state = {
    preview: false,
    showLoginWnd: false,
    showSaveWnd: false,
    showRegisterWnd: false,
    loggedIn: false,
    showAddToCartError: false
  };
  componentDidMount() {
    this.calculatePrice();
    this.setTimer();
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (isEqual(nextState, this.state) && isEqual(this.props, nextProps)) {
      return false;
    }
    return true;
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.authLoggedIn === true && prevState.loggedIn === false) {
      return {
        ...prevState,
        showLoginWnd: false,
        showRegisterWnd: false,
        loggedIn: true
      };
    }
    return null;
  }

  showPrintPreview = () => {
    const oldPreview = this.state.preview;
    if (oldPreview === false) {
      //  this.props.changePage({ page_id: this.props.pagesOrder[0] });
      this.props.previewLoadPage(0);
    } else {
      this.props.previewDisableMode();
    }

    this.setState({ preview: !this.state.preview }, () => {
      this.props.addContainerClasses(
        "PrintPreview",
        [oldPreview === false ? "showPrintPreview" : ""],
        true
      );
    });
    this.setState({ showAddToCartError: false });
    if (this._timer) {
      clearTimeout(this._timer);
    }
  };
  attachPreview = () => {
    const previewState = this.state.preview;
    if (previewState) {
      this.props.attachPreview();
    } else {
      this.setState({ showAddToCartError: true });
      this.setTimer();
    }
  };
  setTimer = () => {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._timer = setTimeout(() => {
      this.setState({ showAddToCartError: false });
      this._timer = null;
    }, 10000);
  };
  calculatePrice = () => {
    const CALCULATE_PRICE_URL =
      ConfigUtils.getConfigProp("baseUrl") +
      "webproduct/printoption/changeOptions/";

    const productInformation = { ...this.props.productInformation };
    const serverData = {
      product: productInformation.productId,
      related_product: false,
      qty: productInformation.qty,
      print_options: productInformation.productOptions.print_options,
      options: productInformation.productOptions.options
    };
    this.props.startGlobalLoading();
    axios
      .post(CALCULATE_PRICE_URL, qs.stringify(serverData))
      .then(resp => resp.data)
      .then(data => {
        if (data) {
          this.props.calculatePriceInitial({
            total_price: data.total_gross_price
          });
        }
        this.props.stopGlobalLoading();
      })
      .catch(error => {
        this.props.stopGlobalLoading();
      });
  };

  showModal = () => {
    if (this.props.projProjectId) {
      return;
    }
    this.props.addContainerClasses(
      "ProjectHeader",
      ["projectHeaderShowModal"],
      false
    );
    if (this.props.authLoggedIn === false) {
      this.setState({ showLoginWnd: true });
    } else {
      this.setState({ showSaveWnd: true });
    }
  };

  closeWnd = () => {
    this.props.addContainerClasses("ProjectHeader", [], false);
    this.setState({
      showLoginWnd: false,
      showSaveWnd: false,
      showRegisterWnd: false
    });
  };

  showRegisterWnd = () => {
    this.closeWnd();
    this.props.addContainerClasses(
      "ProjectHeader",
      ["projectHeaderShowModal"],
      false
    );
    this.setState({ showRegisterWnd: true });
  };

  render() {
    let addToCartError = null;
    const showPagesWarning = this.props.pagesOrder.length % 4 ? true : false;
    const addToCartTooltip = showPagesWarning
      ? { title: "Invalid number of pages", position: "left" }
      : null;

    const titleStyle =
      this.props.projProjectId === null || this.props.projProjectId === 0
        ? { cursor: "pointer" }
        : {};
    if (this.state.showAddToCartError) {
      addToCartError = (
        <div className={"cartError"}>
          <span>
            {this.props.t(
              "Please check your preview first, then add product to cart"
            )}
          </span>
        </div>
      );
    }
    return (
      <React.Fragment>
        {this.state.showLoginWnd && (
          <LoginWnd
            show={true}
            modalClosed={this.closeWnd}
            register={this.showRegisterWnd}
          />
        )}
        {this.state.showSaveWnd && (
          <SaveWnd show={true} modalClosed={this.closeWnd} />
        )}
        {this.state.showRegisterWnd && (
          <RegisterWnd show={true} modalClosed={this.closeWnd} />
        )}

        <div className="projectHeaderContainer">
          <div className="projectHeaderLogo" />
          <div className="projectHeaderCenter">
            <span className="projectHeaderTitle">
              {this.props.t("My project") + ": "}
            </span>
            <span
              className="projectHeaderName"
              onClick={this.showModal}
              style={titleStyle}
            >
              {this.props.t(this.props.projectTitle)}
            </span>
            <span className="projectHeaderSeparator">|</span>
            <div className="printPreviewButtonContainer">
              <button
                className="printPreviewButton"
                onClick={this.showPrintPreview}
              >
                {this.state.preview === false
                  ? this.props.t("Print preview")
                  : this.props.t("Back to editor")}
              </button>
            </div>
          </div>
          <div className="projectHeaderRight">
            <div className="projectRighInfo">
              <div className="projectRightPrice">
                {this.props.qty} {this.props.t("pieces")}{" "}
                {this.props.totalPrice} {"*"}
              </div>
              <div className="projectRrightDescription">
                {this.props.productName}, {this.props.numberOfPages}{" "}
                {this.props.t("pages")}
              </div>
            </div>
            <AddToCartButton
              t={this.props.t}
              tooltip={addToCartTooltip}
              active={!showPagesWarning}
              clicked={this.attachPreview}
            />
          </div>
        </div>
        {addToCartError}
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    projectTitle: titleSelector(state),
    productName: getProductNameSelector(state),
    numberOfPages: getNumberOfPagesSelector(state),
    totalPrice: getTotalPriceSelector(state),
    qty: getQtySelector(state),
    productInformation: getProductInformationSelector(state),
    pagesOrder: pagesOrderSelector(state),
    authLoggedIn: authLoggedInSelector(state),
    projProjectId: projProjectIdSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    previewLoadPage: pageNo => dispatch(previewLoadPage(pageNo)),
    attachPreview: () => dispatch(attachPreview()),
    previewDisableMode: () => dispatch(previewDisableMode()),
    startGlobalLoading: () => dispatch(startGlobalLoading()),
    stopGlobalLoading: () => dispatch(stopGlobalLoading()),
    calculatePriceInitial: payload => dispatch(calculatePriceInitial(payload)),
    changePage: pageId => dispatch(changePage(pageId))
  };
};

const ProjectHeaderPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("projectHeader")(ProjectHeader));

module.exports = {
  ProjectHeader: assign(ProjectHeaderPlugin)
};
