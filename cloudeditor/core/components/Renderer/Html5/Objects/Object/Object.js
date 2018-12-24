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
const Tinymce = require("../Tinymce/Tinymce");

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
const TextBlock = require("../Text/Text");
const ImageBlock = require("../Image/Image");

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
  componentDidUpdate() {
    if (this.editable) {
      this.editable.setFocus();
      this.editable.setCaret();
    }
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
  renderText = () => {
    const props = { ...this.props };
    const { viewOnly, editable } = props;
    const contentEditable = !viewOnly && editable;
    const textProps = {
      id: props.id,
      active: props.active,
      width: props.width,
      maxWidth: props.width,
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
      textAlign: props.textAlign,
      vAlign: props.vAlign,
      underline: props.underline,
      bold: props.bold,
      italic: props.italic,
      type: props.type,
      value: props.value,
      fillColor: props.fillColor.htmlRGB,
      bgColor: props.bgColor.htmlRGB,
      borderColor: props.borderColor.htmlRGB,
      onUpdateProps: props.onUpdatePropsHandler,
      onTextChange: props.onTextChange,
      editableRef: this.getEditableReference,
      contentEditable
    };
    return <TextBlock {...textProps} />;
  };
  renderImage = () => {
    const props = { ...this.props };
    const { viewOnly, editable } = props;
    const imageProps = {
      viewOnly,
      editable,
      id: props.id,
      active: props.active,
      width: props.width,
      height: props.height,
      cropX: props.cropX,
      cropY: props.cropY,
      cropW: props.cropW,
      filter: props.filter,
      cropH: props.cropH,
      onUpdateProps: props.onUpdatePropsHandler,
      image_src: props.image_src,
      leftSlider: props.leftSlider,
      initialRestore: props.initialRestore,
      alternateZoom: props.alternate_zoom,
      resizing: props.resizing,
      zoomScale: this.props.zoomScale,
      workingPercent: this.props.workingPercent
    };

    return <ImageBlock {...imageProps} />;
  };
  renderTable = () => {
    return (
      <Tinymce
        key={this.props.id}
        id={this.props.id}
        tableContent={this.props.tableContent}
        height={this.props.height}
        width={this.props.width}
        onUpdateProps={this.props.onUpdatePropsHandler}
        zoomScale={this.props.zoomScale}
        tableContent={this.props.tableContent}
      />
    );
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
      bgColor,
      borderColor,
      borderWidth,
      type
    } = this.props;

    const classes = [
      "pageBlock",
      type,
      active && !viewOnly ? "active" : "",
      editable ? "editable" : ""
    ].join(" ");

    const style = {
      width,
      height,
      left: left + offsetLeft,
      top: top + offsetTop,
      transform: "rotate(" + angle + "deg)",
      backgroundColor: bgColor.htmlRGB
    };
    const styleBorderColor = {
      width: width + parseFloat(borderWidth),
      height: height + parseFloat(borderWidth),
      borderColor: borderColor.htmlRGB,
      borderWidth: parseFloat(borderWidth),
      top: (-1 * parseFloat(borderWidth)) / 2,
      left: (-1 * parseFloat(borderWidth)) / 2
    };
    let element = null;
    let styleNorth = {};
    let tinyMceResizable = null;
    switch (type) {
      case "textflow":
      case "textline":
        element = this.renderText();
        break;
      case "image":
        element = this.renderImage();
        break;
      case "tinymce":
        element = this.renderTable();
        styleNorth = { width: width + 16, height: height + 16 };
        tinyMceResizable = (
          <React.Fragment>
            <div className="ui-resizable-handle ui-resizable-se ui-icon" />
            <div className="ui-resizable-handle ui-resizable-sw ui-icon" />
            <div className="ui-resizable-handle ui-resizable-ne ui-icon" />
            <div className="ui-resizable-handle ui-resizable-nw ui-icon" />
          </React.Fragment>
        );
        break;
      default:
        break;
    }

    return (
      <div
        onMouseEnter={() => {
          this.props.onUpdatePropsHandler({
            id: this.props.id,
            props: {
              checkSnap: 1
            }
          });
        }}
        onMouseLeave={() => {
          this.props.onUpdatePropsHandler({
            id: this.props.id,
            props: {
              checkSnap: 0
            }
          });
        }}
        onClick={this.onClickBlockHandler}
        className={classes}
        style={style}
        ref={this.getReference}
      >
        <div style={styleNorth} className={"north"}>
          {element}
        </div>
        <div className={"blockBorder"} style={styleBorderColor} />
        <u style={{ width, height }} />
        {tinyMceResizable}
      </div>
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
