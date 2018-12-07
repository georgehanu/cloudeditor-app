const React = require("react");
const PropTypes = require("prop-types");
const randomColor = require("randomcolor");
const { connect } = require("react-redux");
const { compose } = require("redux");
const { includes } = require("ramda");
const $ = require("jquery");

const withDraggable = require("../hoc/withDraggable/withDraggable");
const withResizable = require("../hoc/withResizable/withResizable");
const withRotatable = require("../hoc/withRotatable/withRotatable");
const withSnap = require("../hoc/withSnap/withSnap");

const {
  createDeepEqualSelector: createSelector
} = require("../../../../../rewrites/reselect/createSelector");

const {
  displayedObjectSelector,
  displayedMergedObjectSelector,
  scaledDisplayedObjectSelector,
  selectedObjectsIdsSelector
} = require("../../../../../stores/selectors/Html5Renderer");

const { objectsSelector } = require("../../../../../stores/selectors/project");
require("./Object.css");
const Draggable = require("./Draggable");

const {
  updateObjectProps,
  addObjectIdToSelected
} = require("../../../../../stores/actions/project");

class ObjectBlock extends React.Component {
  constructor(props) {
    super(props);
    this.editable = null;
    this.el = null;
    this.$el = null;
  }

  getEditableReference = ref => {
    this.editable = ref;
  };
  onClickBlockHandler = event => {
    event.preventDefault();
    const { id, viewOnly } = this.props;
    if (viewOnly) return false;
    this.props.handleDraggableUi(this.$el, false);
    const boundingObject = this.el.getBoundingClientRect();
    const { width, height, left, top } = boundingObject;
    const activeElement = { id, boundingRect: { left, top, width, height } };
    this.props.onSetActiveBlockHandler(activeElement);
  };

  getReference = ref => {
    this.el = ref;
    this.$el = $(this.el);
    this.props.getReference(ref);
  };

  render() {
    const {
      width,
      height,
      angle,
      top,
      left,
      active,
      viewOnly,
      editable,
      offsetLeft,
      offsetTop,
      type
    } = this.props;

    const classes = [
      "pageBlock",
      type,
      active && !viewOnly ? "active" : "",
      editable ? "editable" : ""
    ].join(" ");

    const style = {
      width: width,
      height: height,
      left: left + offsetLeft,
      top: top + offsetTop,
      transform: "rotate(" + angle + "deg)",
      backgroundColor: randomColor()
    };
    return (
      <div
        onClick={this.onClickBlockHandler}
        className={classes}
        style={style}
        ref={this.getReference}
      />
    );
  }
}

ObjectBlock.propTypes = {
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  active: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  editable: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

ObjectBlock.defaultProps = {
  viewOnly: 0,
  active: 0,
  editable: 1
};
const makeMapStateToProps = (state, props) => {
  const zoomScale = (_, props) => {
    return props.zoomScale;
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
  const getActivePropSelector = createSelector(
    getBlockId,
    selectedObjectsIdsSelector,
    (cBlockId, selectedIds) => {
      return includes(cBlockId, selectedIds);
    }
  );
  const getDisplayedBlockSelector = displayedObjectSelector(
    activeBlockSelector
  );
  const getDisplayedMergedBlockSelector = displayedMergedObjectSelector(
    getDisplayedBlockSelector,
    getActivePropSelector
  );
  const getScaledDisplayedBlockSelector = scaledDisplayedObjectSelector(
    getDisplayedMergedBlockSelector,
    zoomScale
  );

  const mapStateToProps = (state, props) => {
    const displayedBlock = getDisplayedBlockSelector(state, props);
    const scaledBlock = getScaledDisplayedBlockSelector(state, props);
    return { ...scaledBlock };
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
  mapDispatchToProps
)(
  compose(
    withDraggable,
    withResizable,
    withRotatable,
    withSnap
  )(ObjectBlock)
);
