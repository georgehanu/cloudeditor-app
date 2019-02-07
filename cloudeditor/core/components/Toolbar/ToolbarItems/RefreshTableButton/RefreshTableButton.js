const React = require("react");
const ButtonLoading = require("./ButtonLoading");

const RefreshTableButton = props => {
  return (
    <div className="refreshTableButton">
      <ButtonLoading {...props} />
    </div>
  );
};
module.exports = RefreshTableButton;
