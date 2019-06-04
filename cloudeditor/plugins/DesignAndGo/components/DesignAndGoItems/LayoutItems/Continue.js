const React = require("react");

const { withNamespaces } = require("react-i18next");

const Continue = props => {
  const { t } = props;
  return (
    <div className="continueSection">
      <div className="dgButton" onClick={() => void 0}>
        <label className="label">
          <span className="message">{t("Continue")}</span>
        </label>
      </div>
    </div>
  );
};

module.exports = withNamespaces("designAndGo")(Continue);
