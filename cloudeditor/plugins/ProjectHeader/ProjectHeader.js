const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");
const isEqual = require("react-fast-compare");
const AddToCartButton = require("./components/AddToCartButton");

const {
  titleSelector,
  getNumberOfPagesSelector,
  pagesOrderSelector
} = require("../../core/stores/selectors/project");
const {
  getProductNameSelector
} = require("../../core/stores/selectors/productinformation");
const {
  previewLoadPage,
  previewDisableMode
} = require("../PrintPreview/store/actions");

require("./ProjectHeader.css");
class ProjectHeader extends React.Component {
  state = {
    preview: false
  };

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
              25 {this.props.t("pieces")} 48.92 €
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
    pagesOrder: pagesOrderSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    previewLoadPage: pageNo => dispatch(previewLoadPage(pageNo)),
    previewDisableMode: () => dispatch(previewDisableMode())
  };
};

const ProjectHeaderPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("projectHeader")(ProjectHeader));

module.exports = {
  ProjectHeader: assign(ProjectHeaderPlugin)
};
