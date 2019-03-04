const React = require("react");

const cropImageButton = props => {
  return (
    <div
      className="cropImageContainer"
      onClick={() => props.onCropImageModalOpenHandler()}
    >
      <label className="UploadLabel">
        <span className="UploadMessage">Crop image</span>
      </label>
    </div>
  );
};

module.exports = cropImageButton;
