import React from "react";
import ReactTooltip from "react-tooltip";
const { NamespacesConsumer } = require("react-i18next");

const uuidv4 = require("uuid/v4");

const withTooltip = (WrappedComponent, nameSpace) => props => {
  let tooltipData = {};
  let elementId = null;

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
  }

  return (
    <NamespacesConsumer ns={[nameSpace || "tooltip"]}>
      {(t, { i18n, ready }) => (
        <React.Fragment>
          <WrappedComponent {...props} tooltipData={tooltipData} />
          {props.tooltip && props.tooltip !== undefined && (
            <ReactTooltip id={elementId} place="bottom">
              <div className="Tooltip">
                {props.tooltip.title ? (
                  <React.Fragment>
                    <p className="TooltipTitle">{t(props.tooltip.title)}</p>
                    <p className="TooltipDesc">
                      {t(props.tooltip.description)}
                    </p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <p className="TooltipTitle">{t(props.tooltip)}</p>
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

export default withTooltip;
