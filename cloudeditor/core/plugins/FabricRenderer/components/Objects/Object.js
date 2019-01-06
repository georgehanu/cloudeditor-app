const React = require("react");
const PropTypes = require("prop-types");
const { mergeAll, clone, forEachObjIndexed } = require("ramda");

const { applyZoomScaleToTarget } = require("../../../../utils/UtilUtils");

const ImageLoad = require("./ImageLoad");
const TextLoad = require("./TextLoad");
const GraphicsLoad = require("./GraphicsLoad");

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

    let text = block.text || {};

    forEachObjIndexed((variable, key) => {
      text = text.replace("[%]" + key + "[/%]", variable.value);
      fontSize = 50;
    }, variables);

    let blockProps = {
      ...block,
      left: left + offsetLeft,
      top: top + offsetTop,
      scale: scale,
      offsetLeft: offsetLeft,
      offsetTop: offsetTop
    };

    switch (type) {
      case "image":
        return (
          <ImageLoad
            key={id}
            {...blockProps}
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

module.exports = ObjectBlock;
