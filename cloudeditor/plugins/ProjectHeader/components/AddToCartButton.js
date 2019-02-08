const React = require("react");
const withTooltip = require("../../../core/hoc/withTooltip/withTooltip");

const AddToCartButton = props => {
  const className =
    "projectRightAddContainerButton " +
    (props.active ? "" : "projectRightAddContainerButtonDisabled");
  return (
    <div className="projectRightAddContainer">
      <button
        className={className}
        {...props.tooltipData}
        onClick={() => {
          if (!props.active) return;
          console.log("add to cart");
        }}
      >
        {props.t("Add to cart")}
      </button>
    </div>
  );
};

module.exports = withTooltip(AddToCartButton, "");
