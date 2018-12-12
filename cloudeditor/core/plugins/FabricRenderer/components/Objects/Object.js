const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { pick, values } = require("ramda");

const {
  createDeepEqualSelector: createSelector
} = require("../../../../rewrites/reselect/createSelector");

const {
  displayedObjectSelector,
  displayedMergedObjectSelector,
  scaledDisplayedObjectSelector
} = require("../../../../stores/selectors/Html5Renderer");

const { objectsSelector } = require("../../../../stores/selectors/project");

const {
  updateObjectProps,
  addObjectIdToSelected
} = require("../../../../stores/actions/project");

const ImageLoad = require("./ImageLoad");
const TextLoad = require("./TextLoad");
const GraphicsLoad = require("./GraphicsLoad");

class ObjectBlock extends React.Component {
  render() {
    const {
      block,
      offsetLeft,
      offsetTop,
      pageOffsetX,
      pageOffsetY
    } = this.props;

    const { type, left, top, id } = block;

    let blockProps = {
      ...block,
      left: left + offsetLeft + pageOffsetX,
      top: top + offsetTop + pageOffsetY
    };

    switch (type) {
      case "image":
        return (
          <ImageLoad key={id} {...blockProps} designerCallbacks={() => {}} />
        );
      case "textbox":
        return (
          <TextLoad key={id} {...blockProps} designerCallbacks={() => {}} />
        );
      case "graphics":
        return (
          <GraphicsLoad key={id} {...blockProps} designerCallbacks={() => {}} />
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
const makeMapStateToProps = (state, props) => {
  const scale = (_, props) => {
    return props.scale;
  };
  const getBlockId = (_, props) => {
    return props.id;
  };

  const activeBlockSelector = createSelector(
    objectsSelector,
    getBlockId,
    (objects, blockId) => {
      return objects[blockId];
    }
  );

  const getDisplayedBlockSelector = displayedObjectSelector(
    activeBlockSelector
  );
  const getDisplayedMergedBlockSelector = displayedMergedObjectSelector(
    getDisplayedBlockSelector
  );
  const getScaledDisplayedBlockSelector = scaledDisplayedObjectSelector(
    getDisplayedMergedBlockSelector,
    scale
  );

  const mapStateToProps = (state, props) => {
    const displayedBlock = getDisplayedBlockSelector(state, props);
    const scaledBlock = getScaledDisplayedBlockSelector(state, props);
    return {
      block: scaledBlock
    };
  };
  return mapStateToProps;
};
const mapDispatchToProps = dispatch => {
  return {
    onSetActiveBlockHandler: payload =>
      dispatch(addObjectIdToSelected(payload)),
    onUpdatePropsHandler: payload => dispatch(updateObjectProps(payload))
  };
};

module.exports = connect(
  makeMapStateToProps,
  null
)(ObjectBlock);
