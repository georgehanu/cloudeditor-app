const React = require("react");
const { withNamespaces } = require("react-i18next");

const cropImageButton = props => {
  return (
    <div
      className="cropImageContainer dgButton"
      onClick={() => props.onCropImageModalOpenHandler()}
    >
      <label className="label">
        <span className="message">{props.t("Crop Image")}</span>
      </label>
    </div>
  );
};

module.exports = withNamespaces("designAndGo")(cropImageButton);
