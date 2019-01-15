const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");

const { titleSelector } = require("../../core/stores/selectors/project");
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
              {this.props.productName}, 16 {this.props.t("pages")}
            </div>
          </div>
          <div className="projectRightAddContainer">
            <button className="projectRightAddContainerButton">
              {this.props.t("Add to cart")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projectTitle: titleSelector(state),
    productName: getProductNameSelector(state)
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
