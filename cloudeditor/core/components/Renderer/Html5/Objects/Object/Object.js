const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { compose } = require("redux");
const { includes, equals, omit } = require("ramda");
const { withNamespaces } = require("react-i18next");
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
  selectedObjectsIdsSelector,
  displayedMergedObjectCachedSelector,
  scaledDisplayedObjectCachedSelector
} = require("../../../../../stores/selectors/Html5Renderer");

const { objectsSelector } = require("../../../../../stores/selectors/project");
require("./Object.css");

const TextBlock = require("../Text/Text");
const ImageBlock = require("../Image/Image");
const GraphicBlock = require("../Graphic/Graphic");

const {
  updateObjectProps,
  addObjectIdToSelected,
  deleteObj
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
    if (this.$el) {
      const params = {
        blockContainer: this.$el.get(0),
        blockId: this.props.id
      };
      this.props.checkErrorMessages(params);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const list = [];
    const nProps = omit(list, nextProps);
    const cProps = omit(list, this.props);
    if (equals(nProps, cProps)) {
      return false;
    }
    console.log("update?", this.props.id, nProps, cProps);
    return true;
  }
  getEditableReference = ref => {
    this.editable = ref;
  };
  onClickBlockHandler = event => {
    const { id, viewOnly, editable } = this.props;
    if (viewOnly || !editable) return;
    event.preventDefault();
    if ($(event.target).hasClass("deleteBlockHandler")) {
      return false;
    }

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
    const block = <TextBlock {...textProps} />;
    return this.renderBaseBlock(props, block);
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
      imageWidth: props.imageWidth,
      imageHeight: props.imageHeight,
      cropX: props.cropX,
      cropY: props.cropY,
      cropW: props.cropW,
      filter: props.filter,
      flip: props.flip,
      cropH: props.cropH,
      onUpdateProps: props.onUpdatePropsHandler,
      image_src: props.image_src,
      leftSlider: props.leftSlider,
      initialRestore: props.initialRestore,
      alternateZoom: props.alternate_zoom,
      resizing: props.resizing,
      zoomScale: this.props.zoomScale,
      workingPercent: this.props.workingPercent,
      brightness: this.props.brightness,
      contrast: this.props.contrast
    };

    const block = <ImageBlock {...imageProps} />;
    return this.renderBaseBlock(props, block);
  };
  renderGraphic = () => {
    const props = { ...this.props };
    const { viewOnly, editable } = props;
    const graphicProps = {
      viewOnly,
      editable,
      id: props.id,
      active: props.active,
      width: props.width,
      height: props.height,
      image_src: props.image_src
    };

    const block = <GraphicBlock {...graphicProps} />;
    return this.renderBaseBlock(props, block);
  };

  renderTable = () => {
    const props = { ...this.props };
    const block = (
      <Tinymce
        key={this.props.id}
        id={this.props.id}
        uuid={this.props.uuid}
        tableContent={this.props.tableContent}
        height={this.props.height}
        width={this.props.width}
        onUpdateProps={this.props.onUpdatePropsHandler}
        zoomScale={this.props.zoomScale}
      />
    );

    return this.renderBaseBlock(props, block);
  };

  renderBaseBlock(props, block) {
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
      type,
      subType,
      mirrored,
      parent
    } = props;

    const classes = [
      "pageBlock",
      type,
      subType,
      active && !viewOnly ? "active" : "",
      editable ? "editable" : ""
    ].join(" ");

    const style = {
      width,
      height,
      left: left + offsetLeft,
      top: top + offsetTop,
      transform: "rotate(" + angle + "deg)",
      backgroundColor: "rgb(" + bgColor.htmlRGB + ")"
    };

    if (mirrored) {
      style["left"] = parent.width - style["left"] - width;
    }
    const styleBorderColor = {
      width: width + parseFloat(borderWidth),
      height: height + parseFloat(borderWidth),
      borderColor: "rgb(" + borderColor.htmlRGB + ")",
      borderWidth: parseFloat(borderWidth),
      top: (-1 * parseFloat(borderWidth)) / 2,
      left: (-1 * parseFloat(borderWidth)) / 2
    };
    let styleNorth = {};
    let tinyMceResizable = null;

    if (subType === "tinymceTable") {
      styleNorth = { width: width + 16, height: height + 16 };
      tinyMceResizable = (
        <React.Fragment>
          <div className="ui-resizable-handle ui-resizable-se ui-icon" />
          <div className="ui-resizable-handle ui-resizable-sw ui-icon" />
          <div className="ui-resizable-handle ui-resizable-ne ui-icon" />
          <div className="ui-resizable-handle ui-resizable-nw ui-icon" />
        </React.Fragment>
      );
    }

    let resizableHandle = null;
    if (this.props.resizable && !viewOnly) {
      resizableHandle = (
        <div
          className={
            "ui-rotatable-handle icon printqicon-rotate_handler ui-draggable"
          }
        />
      );
    }
    let deleteHandle = null;
    if (this.props.deletable && !viewOnly) {
      deleteHandle = (
        <div
          onClick={event => {
            event.preventDefault();

            //if (this.props.parent)
            this.props.onDeleteObjectHandler({
              id: this.props.id
            });
          }}
          className={"deleteBlockHandler"}
        >
          x
        </div>
      );
    }
    return (
      <div
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        onClick={this.onClickBlockHandler}
        className={classes}
        style={style}
        ref={this.getReference}
      >
        <div style={styleNorth} className={"blockOrientation north "}>
          {block}
        </div>
        <u style={{ width, height }} />

        {tinyMceResizable}
        {resizableHandle}
        {deleteHandle}
      </div>
    );
  }

  renderHeaderFooter(type) {
    console.log("footers");
    const props = { ...this.props };

    const typeText = type.replace(/^\w/, c => c.toUpperCase());

    const classes = [
      "pageContainer headerFooter",
      props.type,
      props.subType,
      (props.modeHeader === "edit" || props.modeFooter === "edit") &&
      !props.viewOnly
        ? "active"
        : ""
    ].join(" ");
    props.width = props.parent.innerPage.width + 2 * props.parent.offsetLeft;

    props.left = -props.parent.offsetLeft + props.parent.innerPage.offset.left;
    if (type === "header") {
      props.height = props.heightHeader * 2.83465 * props.zoomScale;
      props.top = -props.parent.offsetTop;
    }
    if (type === "footer") {
      props.height = props.heightFooter * 2.83465 * props.zoomScale;
      props.top =
        props.parent.innerPage.height + props.parent.offsetTop - props.height;
    }

    const style = {
      width: props.width,
      height: props.height,
      left: props.left + props.offsetLeft,
      top: props.top + props.offsetTop,
      transform: "rotate(" + (props.angle || 0) + "deg)",
      position: "absolute"
    };

    const innerBlocks = React.Children.map(this.props.children, innerBlock => {
      let offsetTop = 0;
      let offsetLeft =
        props.parent.offsetLeft - props.parent.innerPage.offset.left;

      let mirrored = false;
      let childViewOnly = innerBlock.props.viewOnly;

      switch (type) {
        case "header":
          mirrored = props.mirroredHeader;
          offsetTop = props.offsetTop;
          if (props.modeHeader === "read") {
            childViewOnly = 1;
          }
          if (props.modeHeader === "edit") {
            childViewOnly = 0;
          }
          break;
        case "footer":
          mirrored = props.mirroredFooter;
          offsetTop = 0;
          if (props.modeFooter === "read") {
            childViewOnly = 1;
          }
          if (props.modeFooter === "edit") {
            childViewOnly = 0;
          }
          break;
        default:
          break;
      }

      if (props.viewOnly) childViewOnly = 1;

      return React.cloneElement(innerBlock, {
        key: innerBlock.props.uuid,
        offsetLeft,
        offsetTop,
        mirrored,
        parent: {
          ...innerBlock.props.parent,
          width: props.width,
          height: props.height
        },
        data: {
          ...innerBlock.props.data
        },
        viewOnly: childViewOnly
      });
    });
    return (
      <div className={classes} style={style}>
        {innerBlocks}
        <div className="helperName">{this.props.t(typeText)}</div>
      </div>
    );
  }

  render() {
    let element = null;

    console.log("render", this.props.id);

    switch (this.props.subType) {
      case "textflow":
      case "text":
      case "textline":
        element = this.renderText();
        break;
      case "image":
        element = this.renderImage();
        break;
      case "graphics":
        element = this.renderGraphic();
        break;
      case "tinymceTable":
        element = this.renderTable();
        break;

      default:
        element = null;
        break;
    }

    if (this.props.type === "section") {
      switch (this.props.subType) {
        case "header":
        case "footer":
          element = this.renderHeaderFooter(this.props.subType);
          break;
        default:
          break;
      }
    }

    return element;
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

const mapStateToProps = (state, props) => {
  const displayedMergedObject = displayedMergedObjectCachedSelector(
    state,
    props.uuid,
    props.data
  );

  const scaledObject = scaledDisplayedObjectCachedSelector(
    state,
    props.uuid,
    displayedMergedObject,
    props.zoomScale
  );

  const getActivePropSelector = createSelector(
    (_, props) => {
      return props.id;
    },
    selectedObjectsIdsSelector,
    (cBlockId, selectedIds) => {
      return includes(cBlockId, selectedIds);
    }
  );

  return { ...scaledObject, active: getActivePropSelector(state, props) };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetActiveBlockHandler: payload =>
      dispatch(addObjectIdToSelected(payload)),
    onUpdatePropsHandler: payload => dispatch(updateObjectProps(payload)),
    onDeleteObjectHandler: payload => dispatch(deleteObj(payload))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  compose(
    withNamespaces("translate"),
    withDraggable,
    withResizable,
    withRotatable,
    withSnap
  )(ObjectBlock)
);
