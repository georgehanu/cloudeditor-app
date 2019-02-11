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
  let tooltipIcon = null;

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
    if (props.tooltip.position) {
      position = props.tooltip.position;
    }
    if (props.tooltip.imageSrc) {
      className += " tooltipImage";
      position = "right";

      if (props.tooltip.icon === null || props.tooltip.icon === "null") {
        tooltipIcon = <div className="noLayoutImg" />;
      } else {
        tooltipIcon = (
          <div
            style={{ backgroundImage: 'url("' + props.tooltip.imageSrc + '")' }}
          />
        );
      }
    }
  }

  return (
    <NamespacesConsumer ns={[nameSpace || "tooltip"]}>
      {(t, { i18n, ready }) => (
        <React.Fragment>
          <WrappedComponent {...props} tooltipData={tooltipData} />
          {props.tooltip && props.tooltip !== undefined && (
            <ReactTooltip
              id={elementId}
              place={position}
              afterShow={() => {
                if (props.tooltip.imageSrc && props.addContainerClasses) {
                  props.addContainerClasses(
                    "Tooltip",
                    ["containerMaxZindex"],
                    false
                  );
                }
              }}
              afterHide={() => {
                if (props.tooltip.imageSrc && props.addContainerClasses) {
                  props.addContainerClasses("Tooltip", [], false);
                }
              }}
            >
              <div className={className}>
                {props.tooltip.title ? (
                  <React.Fragment>
                    <p className="tooltipTitle">{t(props.tooltip.title)}</p>
                    {props.tooltip.description && (
                      <p className="tooltipDesc">
                        {t(props.tooltip.description)}
                      </p>
                    )}
                  </React.Fragment>
                ) : props.tooltip.imageSrc ? (
                  <React.Fragment>{tooltipIcon}</React.Fragment>
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
