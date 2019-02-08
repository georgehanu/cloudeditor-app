const React = require("react");
const ButtonLoading = require("./ButtonLoading");

const RefreshTableButton = props => {
  if (props.visible === false) return null;
  return (
    <div className="refreshTableButton">
      <ButtonLoading {...props} />
    </div>
  );
};
module.exports = RefreshTableButton;
