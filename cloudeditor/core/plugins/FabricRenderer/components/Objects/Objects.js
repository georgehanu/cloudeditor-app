const React = require("react");

const ObjectBlock = require("./Object");
const { pick, keys } = require("ramda");
const { connect } = require("react-redux");

const {
  extractVariablesFromString
} = require("../../../../utils/VariableUtils");

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
    let blockVariables = [];
    if (completeObjects[obKey].type === "textbox") {
      blockVariables = extractVariablesFromString(completeObjects[obKey].text);
    } else if (
      completeObjects[obKey].type === "image" &&
      completeObjects[obKey].image_upload_src
    ) {
      blockVariables = extractVariablesFromString(
        completeObjects[obKey].image_upload_src
      );
    }
    return (
      <ObjectBlock
        key={obKey}
        id={obKey}
        offsetLeft={offsetLeft + pageOffsetX}
        offsetTop={offsetTop + pageOffsetY}
        object={completeObjects[obKey]}
        variables={pick(blockVariables, variables)}
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
// const mapStateToProps = (state, props) => {
//   return {
//     //items: dagDataItemsSelector(state),
//     //completeObjects: pick(keys(props.objects), state.project.objects),
//     stateObjects: state.project.objects,
//     variables: state.variables.variables,
//     configs: state.project.configs.objects
//   };
// };

// module.exports = connect(
//   mapStateToProps,
//   null
// )(objects);
