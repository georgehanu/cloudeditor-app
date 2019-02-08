const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");
const isEqual = require("react-fast-compare");
const axios = require("axios");
const qs = require("qs");
const AddToCartButton = require("./components/AddToCartButton");

const {
  titleSelector,
  getNumberOfPagesSelector,
  pagesOrderSelector
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

require("./ProjectHeader.css");
class ProjectHeader extends React.Component {
  state = {
    preview: false
  };
  componentDidMount() {
    this.calculatePrice();
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (isEqual(nextState, this.state) && isEqual(this.props, nextProps)) {
      return false;
    }
    return true;
  };

  showPrintPreview = () => {
    const oldPreview = this.state.preview;
    if (oldPreview === false) {
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
  };
  attachPreview = () => {
    const previewState = this.state.preview;
    if (previewState) {
      this.props.attachPreview();
    }
  };
  calculatePrice = () => {
    const CALCULATE_PRICE_URL =
      "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/webproduct/printoption/changeOptions/";

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
          this.props.calculatePriceInitial({ total_price: data.total_price });
        }
        this.props.stopGlobalLoading();
      })
      .catch(error => {
        this.props.stopGlobalLoading();
      });
  };
  render() {
    const showPagesWarning = this.props.pagesOrder.length % 4 ? true : false;
    const addToCartTooltip = showPagesWarning
      ? "Invalid number of pages"
      : null;
    return (
      <div className="projectHeaderContainer">
        <div className="projectHeaderLogo" />
        <div className="projectHeaderCenter">
          <span className="projectHeaderTitle">
            {this.props.t("My project")}:
          </span>
          <span className="projectHeaderName">{this.props.projectTitle}</span>
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
              {this.props.qty} {this.props.t("pieces")} {this.props.totalPrice}
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
    pagesOrder: pagesOrderSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    previewLoadPage: pageNo => dispatch(previewLoadPage(pageNo)),
    attachPreview: () => dispatch(attachPreview()),
    previewDisableMode: () => dispatch(previewDisableMode()),
    startGlobalLoading: () => dispatch(startGlobalLoading()),
    stopGlobalLoading: () => dispatch(stopGlobalLoading()),
    calculatePriceInitial: payload => dispatch(calculatePriceInitial(payload))
  };
};

const ProjectHeaderPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("projectHeader")(ProjectHeader));

module.exports = {
  ProjectHeader: assign(ProjectHeaderPlugin)
};
