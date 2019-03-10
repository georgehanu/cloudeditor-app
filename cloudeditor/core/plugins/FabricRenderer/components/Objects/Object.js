const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { pick, values, mergeAll, clone, forEachObjIndexed } = require("ramda");

const {
  extractVariablesFromString
} = require("../../../../utils/VariableUtils");

const {
  createDeepEqualSelector: createSelector
} = require("../../../../rewrites/reselect/createSelector");

const {
  displayedObjectSelector,
  displayedMergedObjectSelector,
  scaledDisplayedObjectSelector,
  scaledDisplayedObjectCachedSelector
} = require("../../../../stores/selectors/Html5Renderer");

const { objectsSelector } = require("../../../../stores/selectors/project");
const {
  variablesVariableSelector
} = require("../../../../stores/selectors/variables");

const {
  updateObjectProps,
  addObjectIdToSelected
} = require("../../../../stores/actions/project");

const { applyZoomScaleToTarget } = require("../../../../utils/UtilUtils");

const ImageLoad = require("./ImageLoad");
const TextLoad = require("./TextLoad");
const GraphicsLoad = require("./GraphicsLoad");

const replaceColor = (type, object, variables) => {
  let color = object[type];
  const colorVariables = extractVariablesFromString(object[type]);
  forEachObjIndexed((variable, key) => {
    color = object[type].replace("[%]" + key + "[/%]", variable.value);
  }, pick(colorVariables, variables));
  return { [type]: color };
};

class ObjectBlock extends React.PureComponent {
  render() {
    const {
      offsetLeft,
      offsetTop,
      designerCallbacks,
      scale,
      object,
      configs,
      variables
    } = this.props;

    const newBlock = mergeAll([
      configs.generalCfg,
      configs[object.realType + "Cfg"],
      object
    ]);

    let block = clone(newBlock);
    if (scale !== 1) {
      const defaultPaths = [
        ["width"],
        ["height"],
        ["top"],
        ["left"],
        ["fontSize"]
      ];

      block = applyZoomScaleToTarget(block, scale, defaultPaths);
    }

    const { type, left, top, id } = block;

    let text = "";
    let image_src = block.image_src || {};
    let imageHeight = block.imageHeight || 0;
    let imageWidth = block.imageWidth || 0;

    if (type === "textbox") {
      text = block.text || {};

      forEachObjIndexed((variable, key) => {
        text = text.replace("[%]" + key + "[/%]", variable.value);
        fontSize = 50;
      }, variables);
    } else if (type === "image" && block.image_upload_src) {
      forEachObjIndexed((variable, key) => {
        if (variable.value) {
          image_src = block.image_upload_src.replace(
            "[%]" + key + "[/%]",
            variable.value
          );
          imageHeight = variable.imageHeight;
          imageWidth = variable.imageWidth;
        }
      }, variables);
    }

    let blockProps = {
      ...block,
      left: left + offsetLeft,
      top: top + offsetTop,
      scale: scale,
      offsetLeft: offsetLeft,
      offsetTop: offsetTop
    };

    if (this.props.object.fill) {
      const fillColor = replaceColor(
        "fill",
        this.props.object,
        this.props.mainVariables
      );
      blockProps = {
        ...blockProps,
        ...fillColor
      };
    } else {
      delete blockProps.fill;
    }

    switch (type) {
      case "image":
        return (
          <ImageLoad
            key={id}
            {...blockProps}
            image_src={image_src}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            designerCallbacks={designerCallbacks}
          />
        );
      case "textbox":
        return (
          <TextLoad
            key={id}
            {...blockProps}
            text={text}
            designerCallbacks={designerCallbacks}
          />
        );
      case "graphics":
        return (
          <GraphicsLoad
            key={id}
            {...blockProps}
            ddesignerCallbacks={designerCallbacks}
          />
        );
      default:
        component = null;
        break;
    }

    return null;
  }
}

ObjectBlock.propTypes = {
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  active: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  scale: PropTypes.number,
  editable: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

ObjectBlock.defaultProps = {
  viewOnly: 0,
  active: 0,
  scale: 1,
  editable: 1
};

const mapStateToProps = (state, props) => {
  const scaledBlock = scaledDisplayedObjectCachedSelector(
    state,
    props.id,
    props.scale
  );

  const variables = scaledBlock["variables"];

  let Block = scaledBlock["scaledBlock"];
  if (variables.length) {
    Block = { ...Block };
    variables.forEach(variable => {
      const varDef = variablesVariableSelector(state, variable);
      //const varDef = { value: 1 };
      Block.text = Block.text.replace("[%]" + variable + "[/%]", varDef.value);
    });
  }

  return {
    block: Block
  };
};

module.exports = ObjectBlock;
