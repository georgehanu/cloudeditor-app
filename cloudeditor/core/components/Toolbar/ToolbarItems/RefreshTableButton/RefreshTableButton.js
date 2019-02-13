const React = require("react");
const ButtonLoading = require("./ButtonLoading");
const { withNamespaces } = require("react-i18next");

const zeroPadding = number => {
  return number > 9 ? number : "0" + number;
};
const RefreshTableButton = props => {
  if (props.visible === false) return null;
  const lastData = new Date(props.lastRefreshTime);
  const month = 1 + lastData.getMonth();
  const showDate =
    zeroPadding(lastData.getDate()) +
    "." +
    zeroPadding(month) +
    "." +
    lastData.getFullYear();
  const showTime =
    zeroPadding(lastData.getHours()) + ":" + zeroPadding(lastData.getMinutes());
  return (
    <div className="refreshTableButtonContainer">
      <div className="refreshTableTextContainer">
        <div className="refreshTableText">
          <span>{props.t("Last update")}</span>
        </div>
        <div className="refreshTableDate">
          <span>{showDate + " " + showTime}</span>
        </div>
      </div>
      <div className="refreshTableButton">
        <ButtonLoading {...props} />
      </div>
    </div>
  );
};

module.exports = withNamespaces("translate")(RefreshTableButton);
