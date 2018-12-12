const React = require("react");

const ObjectBlock = require("./Object");

const objects = props => {
  const {
    objects,
    pageOffsetX,
    pageOffsetY,
    scale,
    viewOnly,
    designerCallbacks
  } = props;

  return Object.keys(objects).map(obKey => {
    const { offsetLeft, offsetTop } = objects[obKey];
    return (
      <ObjectBlock
        key={obKey}
        id={obKey}
        offsetLeft={offsetLeft + pageOffsetX}
        offsetTop={offsetTop + pageOffsetY}
        scale={scale}
        viewOnly={viewOnly}
        designerCallbacks={designerCallbacks}
      />
    );
  });
};

module.exports = objects;
