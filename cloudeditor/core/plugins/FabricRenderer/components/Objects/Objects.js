const React = require("react");

const ObjectBlock = require("./Object");
const { pick, keys } = require("ramda");
const { connect } = require("react-redux");

const objects = props => {
  const {
    objects,
    pageOffsetX,
    pageOffsetY,
    scale,
    viewOnly,
    designerCallbacks,
    configs,
    variables
  } = props;

  const completeObjects = pick(keys(props.objects), props.stateObjects);

  return Object.keys(objects).map(obKey => {
    const { offsetLeft, offsetTop } = objects[obKey];
    return (
      <ObjectBlock
        key={obKey}
        id={obKey}
        offsetLeft={offsetLeft + pageOffsetX}
        offsetTop={offsetTop + pageOffsetY}
        object={completeObjects[obKey]}
        configs={configs}
        scale={scale}
        viewOnly={viewOnly}
        designerCallbacks={designerCallbacks}
        mainVariables={variables}
      />
    );
  });
};

module.exports = objects;
