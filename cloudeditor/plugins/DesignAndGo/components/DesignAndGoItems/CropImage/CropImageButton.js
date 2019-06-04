const React = require("react");

const cropImageButton = props => {
  return (
    <div
      className="cropImageContainer dgButton"
      onClick={() => props.onCropImageModalOpenHandler()}
    >
      <label className="label">
        <span className="message">Crop image</span>
      </label>
    </div>
  );
};

module.exports = cropImageButton;
