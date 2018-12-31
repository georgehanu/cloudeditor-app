const React = require("react");
const ReactTooltip = require("react-tooltip");
const { NamespacesConsumer } = require("react-i18next");

const uuidv4 = require("uuid/v4");
require("./withTooltip.css");

const withTooltip = (WrappedComponent, nameSpace) => props => {
  let tooltipData = {};
  let elementId = null;
  let className = "tooltip ";
  let position = "bottom";

  if (props.tooltip && props.tooltip !== undefined) {
    // we need tooltip data but this requires to bind it to the elementId - create it if it does not exist
    if (props.id === undefined) {
      elementId = uuidv4();
      tooltipData = {
        "data-tip": "true",
        "data-for": elementId,
        id: elementId
      };
    } else {
      elementId = props.id;
      tooltipData = {
        "data-tip": "true",
        "data-for": elementId
      };
    }
    if (props.tooltip.imageSrc) {
      className += " tooltipImage";
      position = "right";
    }
  }

  return (
    <NamespacesConsumer ns={[nameSpace || "tooltip"]}>
      {(t, { i18n, ready }) => (
        <React.Fragment>
          <WrappedComponent {...props} tooltipData={tooltipData} />
          {props.tooltip && props.tooltip !== undefined && (
            <ReactTooltip id={elementId} place={position}>
              <div className={className}>
                {props.tooltip.title ? (
                  <React.Fragment>
                    <p className="tooltipTitle">{t(props.tooltip.title)}</p>
                    <p className="tooltipDesc">
                      {t(props.tooltip.description)}
                    </p>
                  </React.Fragment>
                ) : props.tooltip.imageSrc ? (
                  <React.Fragment>
                    <div>
                      <img src={props.tooltip.imageSrc} alt="" />
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <p className="tooltipTitle">{t(props.tooltip)}</p>
                  </React.Fragment>
                )}
              </div>
            </ReactTooltip>
          )}
        </React.Fragment>
      )}
    </NamespacesConsumer>
  );
};

module.exports = withTooltip;
