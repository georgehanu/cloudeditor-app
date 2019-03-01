const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { compose } = require("redux");
const { includes, equals, omit } = require("ramda");
const $ = require("jquery");
const BlockOrientation = require("./BlockOrientation");

const withDraggable = require("../hoc/withDraggable/withDraggable");
const withResizable = require("../hoc/withResizable/withResizable");
const withRotatable = require("../hoc/withRotatable/withRotatable");
const withSnap = require("../hoc/withSnap/withSnap");
const Tinymce = require("../Tinymce/Tinymce");
const TinymcePagination = require("../Tinymce/TinymcePagination");

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
const {
  permissionsSelector,
  uiFontsTinymceSelector
} = require("../../../../../stores/selectors/ui");
require("./Object.css");

const TextBlock = require("../Text/Text");
const ImageBlock = require("../Image/Image");
const DummyImage = require("../Image/DummyImage");
const GraphicBlock = require("../Graphic/Graphic");

const {
  updateObjectProps,
  addObjectIdToSelected,
  updateObjectPropsNoUndoRedo,
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
      if (this.props.type === "image") {
        return;
      }
      const params = {
        blockContainer: this.$el.get(0),
        blockId: this.props.id,
        dragging: this.props.dragging
      };
      if (!this.props.backgroundblock) {
        this.props.checkErrorMessages(params);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const list = [];
    const nProps = omit(list, nextProps);
    const cProps = omit(list, this.props);
    if (equals(nProps, cProps)) {
      return false;
    }
    if (nextProps.resizing && this.props.viewOnly) {
      return false;
    }
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
      height: props.height,
      maxWidth: props.width,
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
      textAlign: props.textAlign,
      vAlign: props.vAlign,
      underline: props.underline,
      bold: props.bold,
      italic: props.italic,
      type: props.type,
      value:
        props.isPageNrBlock && !props.value.length
          ? props.labelPage.longLabel
          : props.value,
      fillColor: props.fillColor.htmlRGB,
      bgColor: props.bgColor.htmlRGB,
      borderColor: props.borderColor.htmlRGB,
      onUpdateProps: props.onUpdatePropsHandler,
      onUpdatePropsNoUndoRedo: props.onUpdateNoUndoRedoPropsHandler,
      onTextChange: props.onTextChange,
      editableRef: this.getEditableReference,
      zoomScale: this.props.zoomScale,
      renderId: this.props.renderId,
      placeHolder: this.props.placeHolder,
      contentEditable,
      lineheightn: props.lineheightn,
      lineheightp: props.lineheightp
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
      onUpdatePropsNoUndoRedo: props.onUpdateNoUndoRedoPropsHandler,
      image_src: props.image_src,
      leftSlider: props.leftSlider,
      initialRestore: props.initialRestore,
      alternateZoom: props.alternateZoom,
      resizing: props.resizing,
      zoomScale: this.props.zoomScale,
      workingPercent: this.props.workingPercent,
      brightness: this.props.brightness,
      renderId: this.props.renderId,
      deleteMissingImages: this.props.deleteMissingImages,
      setMissingImages: this.props.setMissingImages,
      missingImage: this.props.missingImage,
      bgColor: props.bgColor,
      subType: props.subType,
      backgroundblock: props.backgroundblock,
      contrast: props.contrast,
      opacity: props.opacity,
      activeAction: props.activeAction,
      naturalWidth: props.naturalWidth,
      naturalHeight: props.naturalHeight
    };
    let block = null;
    if (viewOnly) {
      block = <DummyImage {...imageProps} />;
    } else {
      block = <ImageBlock key={props.id} {...imageProps} />;
    }
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
      image_src: props.image_src,
      onUpdateProps: props.onUpdatePropsHandler,
      onUpdatePropsNoUndoRedo: props.onUpdateNoUndoRedoPropsHandler
    };

    const block = <GraphicBlock {...graphicProps} />;
    return this.renderBaseBlock(props, block);
  };

  renderTable = () => {
    const props = { ...this.props };

    const tableProps = {
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
      textAlign: props.textAlign,
      underline: props.underline,
      bold: props.bold,
      italic: props.italic,
      fillColor: props.fillColor.htmlRGB,
      bgColor: props.bgColor.htmlRGB,
      borderColor: props.borderColor.htmlRGB,
      toolbarUpdate: props.toolbarUpdate
    };
    const block = this.props.viewOnly ? (
      <TinymcePagination
        key={this.props.id}
        id={this.props.id}
        uuid={this.props.uuid}
        tableContent={this.props.tableContent}
        height={this.props.height}
        width={this.props.width}
        zoomScale={this.props.zoomScale}
        viewOnly={this.props.viewOnly}
        {...tableProps}
      />
    ) : (
      <Tinymce
        key={this.props.id}
        id={this.props.id}
        uuid={this.props.uuid}
        tableContent={this.props.tableContent}
        height={this.props.height}
        width={this.props.width}
        tableHeight={this.props.tableHeight}
        tableWidth={this.props.tableWidth}
        onUpdateProps={this.props.onUpdatePropsHandler}
        onUpdatePropsNoUndoRedo={this.props.onUpdateNoUndoRedoPropsHandler}
        zoomScale={this.props.zoomScale}
        viewOnly={this.props.viewOnly}
        active={this.props.active}
        uiFonts={this.props.uiFonts}
        t={this.props.t}
        {...tableProps}
      />
    );

    return this.renderBaseBlock(props, block);
  };

  renderBaseBlock(props, block) {
    const {
      width,
      height,
      rotateAngle,
      top,
      left,
      active,
      viewOnly,
      bottomPagination,
      editable,
      offsetLeft,
      offsetTop,
      bgColor,
      borderColor,
      borderWidth,
      type,
      subType,
      mirrored,
      parent,
      backgroundblock,
      zoomScale
    } = props;

    const newWidth = width + borderWidth * 2;
    const newHeight = height + borderWidth * 2;

    const classes = [
      "pageBlock",
      type,
      subType,
      active && !viewOnly ? "active" : "",
      backgroundblock && !viewOnly ? "backgroundblock" : "",
      backgroundblock && viewOnly ? "backgroundblockPagination" : "",
      editable ? "editable" : "",
      !viewOnly ? "block_" + props.id : ""
    ].join(" ");

    const style = {
      width: newWidth,
      height: newHeight,
      left: left + offsetLeft,
      top: top + offsetTop,
      transform: "rotate(" + rotateAngle + "deg)",
      padding: borderWidth,
      zIndex: this.props.active ? 999999 : "",
      backgroundColor:
        subType !== "tinymceTable" ? "rgb(" + bgColor.htmlRGB + ")" : ""
    };

    if (mirrored) {
      style["left"] = parent.width - style["left"] - width;
    }
    const styleBorderColor = {
      width: newWidth,
      height: newHeight,
      borderColor:
        subType != "tinymce" ? "rgb(" + borderColor.htmlRGB + ")" : "",
      borderWidth: subType != "tinymce" ? parseFloat(borderWidth) : ""
    };
    let styleNorth = {};

    if (subType === "tinymceTable") {
      styleNorth = { width, height };
    }
    let dashedBorder = null;
    if (!bottomPagination) {
      dashedBorder = <u style={{ width: newWidth, height: newHeight }} />;
    }
    let rotatableHandle = null;
    if (this.props.rotatable && !viewOnly) {
      rotatableHandle = (
        <div className={"ui-rotatable-handle icon printqicon-rotate_handler"} />
      );
    }
    let deleteHandle = null;
    if (this.props.deletable && !viewOnly && !this.props.backgroundblock) {
      deleteHandle = (
        <div
          onClick={event => {
            event.preventDefault();

            //if (this.props.parent)
            this.props.onDeleteObjectHandler({
              id: this.props.id
            });
            // this.props.deleteMissingImages(this.props.id);
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
        <BlockOrientation
          width={width}
          height={height}
          zoomScale={zoomScale}
          subType={subType}
        >
          {block}
        </BlockOrientation>
        {<div className={"blockBorder"} style={styleBorderColor} />}
        {dashedBorder}
        {rotatableHandle}
        {deleteHandle}
      </div>
    );
  }

  renderHeaderFooter(type) {
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
        deleteMissingImages: props.deleteMissingImages,
        setMissingImages: props.setMissingImages,
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

    const activeHeader = props.modeHeader === "edit" && type === "header";
    const activeFooter = props.modeFooter === "edit" && type === "footer";
    const overlayStyle = {
      width: props.width,
      top: type === "header" ? props.height : 0,
      position: "absolute",
      paddingBottom: props.height,
      display: "block"
    };
    return (
      <React.Fragment>
        <div className={classes} style={style}>
          {innerBlocks}
          <div className="helperName">
            {this.props.t !== undefined ? this.props.t(typeText) : typeText}
          </div>
        </div>
        {this.props.viewOnly === 0 && (activeHeader || activeFooter) && (
          <div className="headerFooterOverlay" style={overlayStyle}>
            <div
              className="headerFooterOverlayInner"
              id="headerFooterOverlayId"
            />
          </div>
        )}
      </React.Fragment>
    );
  }

  render() {
    let element = null;

    switch (this.props.subType) {
      case "textflow":
      case "text":
      case "textline":
        element = this.renderText();
        break;
      case "image":
      case "pdf":
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

  return {
    ...scaledObject,
    active: getActivePropSelector(state, props),
    permissions: permissionsSelector(state, props),
    uiFonts: uiFontsTinymceSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetActiveBlockHandler: payload =>
      dispatch(addObjectIdToSelected(payload)),
    onUpdatePropsHandler: payload => dispatch(updateObjectProps(payload)),
    onUpdateNoUndoRedoPropsHandler: payload =>
      dispatch(updateObjectPropsNoUndoRedo(payload)),
    onDeleteObjectHandler: payload => dispatch(deleteObj(payload))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  compose(
    withDraggable,
    withResizable,
    withRotatable,
    withSnap
  )(ObjectBlock)
);
