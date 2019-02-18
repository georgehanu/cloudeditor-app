const React = require("react");
const withSpinner = require("../../../core/hoc/withSpinner/withSpinner");
const Gallery = require("../../../core/components/Gallery/Gallery");
const TYPE = "layout";

const layoutsContainer = props => {
  return (
    <div className="LayoutsContainer">
      <Gallery
        type={TYPE}
        hideActions={true}
        addContainerClasses={props.addContainerClasses}
        selectImage={props.selectImage}
        category_id={props.category_id}
      />
    </div>
  );
};

module.exports = withSpinner(layoutsContainer);
