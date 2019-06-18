const React = require("react");
const { useState } = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");

const {
  previewLoadPage,
  previewDisableMode,
  attachPreview
} = require("../../../plugins/PrintPreview/store/actions");

const Continue = props => {
  const [preview, setPreview] = useState(false);
  const { t } = props;

  showPrintPreview = () => {
    if (!preview) {
      setPreview(true);
      props.addContainerClasses("DGPrintPreview", ["showPrintPreview"], false);
      props.previewLoadPage(0);
    } else {
      //add 2 cart
    }
  };

  showEditForm = () => {
    setPreview(false);
    props.previewDisableMode();
    props.addContainerClasses("DGPrintPreview", [""], false);
  };

  return (
    <div className="continueSection">
      <div className="dgButton previewBtn" onClick={showPrintPreview}>
        <label className="label">
          <span className="message">{t("Next")}</span>
        </label>
      </div>
      <div className="backToEdit">
        <span>&nbsp;{t("or")}&nbsp;</span>
        <div className="dgTextButton" onClick={showEditForm}>
          <a href="javascript:void(0)" className="label">
            {t("Back")}
          </a>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {};
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

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("designAndGo")(Continue));