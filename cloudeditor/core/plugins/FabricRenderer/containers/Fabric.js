const React = require("react");
const { debounce } = require("underscore");
const { connect } = require("react-redux");
const uuidv4 = require("uuid/v4");
const { map, concat } = require("ramda");

const { computeZoomScale } = require("../../../utils/UtilUtils");

const {
  Image,
  IText,
  Textbox,
  Fabric,
  Group,
  Graphics,
  Line,
  BleedBox,
  TrimBox
} = require("../components/index");

const ImageLoad = require("../components/Helpers/ImageLoad");
const TextLoad = require("../components/Helpers/TextLoad");
const GraphicsLoad = require("../components/Helpers/GraphicsLoad");

const { activePageSelector } = require("../../../stores/selectors/project");

const {
  addObjectIdToSelected,
  removeSelection,
  updateObjectProps
} = require("../../../stores/actions/project");

const {
  updateSelectionObjectsCoords
} = require("../../../stores/actions/project");

const projectActions = require("../../../stores/actions/project");
const uiActions = require("../../../stores/actions/ui");
const rendererActions = require("../../../stores/actions/renderer");
const {
  trimboxLinesSelector,
  bleedLinesSelector
} = require("../../../stores/selectors/Html5/Boxes");

const updatePageOffset = (props, editorContainer) => {
  const { adjustment, activePage } = props;

  let parentDimension = editorContainer.getBoundingClientRect();

  let scale = Math.min(
    parentDimension.height / activePage.height,
    parentDimension.width / activePage.width
  );
  let pageWidth = activePage.width * scale,
    pageHeight = activePage.height * scale;

  const result = {
    isReadyComponent: true,
    width: parentDimension.width,
    height: parentDimension.height,
    canvasOffsetX: (parentDimension.width - pageWidth) / 2,
    canvasOffsetY: (parentDimension.height - pageHeight) / 2,
    canvasWorkingWidth: pageWidth,
    canvasWorkingHeight: pageHeight,
    scale: scale
  };

  return result;
};

class FabricRenderer extends React.Component {
  state = {
    editorContainer: null,
    isReadyComponent: false,
    width: 0,
    height: 0,
    canvasOffsetX: 0,
    canvasOffsetY: 0,
    canvasWorkingWidth: 0,
    canvasWorkingHeight: 0,
    scale: 1
  };
  constructor(props) {
    super(props);
    this.editorContainer = React.createRef();
    this.state = {
      isReadyComponent: false,
      width: 0,
      height: 0,
      canvasOffsetX: 0,
      canvasOffsetY: 0,
      canvasWorkingWidth: 0,
      canvasWorkingHeight: 0,
      scale: 1,
      events: [
        {
          id: uuidv4(),
          event_name: "before:overlay:render",
          callback: this.onBeforeOverlayHandler
        },
        {
          id: uuidv4(),
          event_name: "selection:created",
          callback: this.onSelectedCreatedHandler
        },
        {
          id: uuidv4(),
          event_name: "selection:updated",
          callback: this.onSelectedCreatedHandler
        },
        {
          id: uuidv4(),
          event_name: "selection:cleared",
          callback: this.onSelectedClearedHandler
        },
        {
          id: uuidv4(),
          event_name: "object:moved",
          callback: this.onObjectPropChangedHandler
        },
        {
          id: uuidv4(),
          event_name: "object:scaled",
          callback: this.onObjectPropChangedHandler
        },
        {
          id: uuidv4(),
          event_name: "object:rotated",
          callback: this.onObjectPropChangedHandler
        },
        {
          id: uuidv4(),
          event_name: "image:editing:exited",
          callback: this.onObjectPropChangedHandler
        },
        {
          id: uuidv4(),
          event_name: "text:editing:exited",
          callback: this.onObjectPropChangedHandler
        }
      ]
    };
  }

  updatePageOffset = () => {
    const result = updatePageOffset(this.props, this.editorContainer.current);
    this.props.uiUpdateWorkAreaOffsetPageOfsset(
      { x: result.canvasOffsetX, y: result.canvasOffsetY },
      result.scale,
      {
        workingWidth: result.canvasWorkingWidth,
        workingHeight: result.canvasWorkingHeight,
        fullWidth: result.width,
        fullHeight: result.height
      }
    );
    this.setState(result);
  };

  componentDidMount() {
    this.updatePageOffset();
    window.addEventListener("resize", debounce(this.updatePageOffset));
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.activePage.id !== this.props.activePage.id) {
      this.updatePageOffset();
    }
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePageOffset);
  }

  onBeforeOverlayHandler = params => {
    if (params.canvas.interactive) {
      var lowPoint = fabric.util.transformPoint(
          new fabric.Point(
            params.canvas.getCanvasOffsetX(),
            params.canvas.getCanvasOffsetY()
          ),
          params.canvas.viewportTransform
        ),
        upPoint = fabric.util.transformPoint(
          new fabric.Point(
            params.canvas.getCanvasWorkingWidth(),
            params.canvas.getCanvasWorkingHeight()
          ),
          params.canvas.viewportTransform,
          1
        ),
        n = params.canvas.getWidth(),
        r = params.canvas.getHeight();

      params.ctx.fillStyle = params.canvas.translucentOverlayOutside;
      params.ctx.beginPath();
      params.ctx.rect(0, 0, n, r);

      params.ctx.rect(lowPoint.x, lowPoint.y, upPoint.x, upPoint.y);
      params.ctx.fill("evenodd");
      params.ctx.closePath();
    }
  };
  onSelectedCreatedHandler = args => {
    if (args && args.target) {
      switch (args.target.type) {
        case "activeSelection":
          let activeSelectionData = {
            id: args.target.id,
            props: {
              left: args.target.left,
              top: args.target.top,
              width: args.target.width,
              height: args.target.height
            },
            objectProps: map(obj => {
              return {
                id: obj.id,
                left:
                  (obj.left -
                    this.state.canvasOffsetX -
                    obj.offsetLeft * this.state.scale) /
                  this.state.scale,
                top:
                  (obj.top -
                    this.state.canvasOffsetY -
                    obj.offsetTop * this.state.scale) /
                  this.state.scale
              };
            }, args.selected)
          };
          this.props.updateSelectionObjectsCoordsHandler(activeSelectionData);
          break;
        default:
          this.props.addObjectToSelectedHandler(args.target.id);
          break;
      }
    }
  };
  onSelectedClearedHandler = args => {
    if (args && args.deselected) {
      let selectionData = {
        objectProps: map(obj => {
          return {
            id: obj.id,
            left:
              (obj.left -
                this.state.canvasOffsetX -
                obj.offsetLeft * this.state.scale) /
              this.state.scale,
            top:
              (obj.top -
                this.state.canvasOffsetY -
                obj.offsetTop * this.state.scale) /
              this.state.scale,
            angle: obj.angle
          };
        }, args.deselected)
      };
      this.props.removeSelection(selectionData);
    }
  };

  onObjectPropChangedHandler = args => {
    if (args && args.target) {
      if (args.target.type == "activeSelection") {
        let activeSelectionData = {
          id: args.target.id,
          props: args.target.getMainProps(),
          objectProps: []
        };
        this.props.updateSelectionObjectsCoordsHandler(activeSelectionData);
      } else {
        let objProps = args.target.getMainProps();
        objProps.left =
          (objProps.left -
            this.state.canvasOffsetX -
            objProps.offsetLeft * this.state.scale) /
          this.state.scale; //;
        objProps.top =
          (objProps.top -
            this.state.canvasOffsetY -
            objProps.offsetTop * this.state.scale) /
          this.state.scale; // ;
        objProps.width =
          (objProps.width / this.state.scale) * args.target.scaleX;
        objProps.height =
          (objProps.height / this.state.scale) * args.target.scaleY;
        objProps.scaleX = 1;
        objProps.scaleY = 1;
        this.props.updateObjectProps({
          id: args.target.id,
          props: objProps
        });
      }
    }
  };
  designerCallbacks = () => {
    return {
      updateCropParams: this.props.updateCropParams,
      updateObjectProps: this.props.updateObjectProps
    };
  };

  drawElements(objects, needOffset) {
    let elements = Object.keys(objects).map(obKey => {
      const object = { ...objects[obKey] };

      if (object.parentId) {
        return null;
      }
      object.width *= this.state.scale;
      object.height *= this.state.scale;
      object.left = object.left * this.state.scale;
      object.top = object.top * this.state.scale;
      if (needOffset) {
        object.left =
          object.left +
          this.state.canvasOffsetX +
          object.offsetLeft * this.state.scale;
        object.top =
          object.top +
          this.state.canvasOffsetY +
          object.offsetTop * this.state.scale;
      }

      switch (object.type) {
        case "image":
          return (
            <ImageLoad
              key={object.id}
              {...object}
              designerCallbacks={this.designerCallbacks}
            />
          );
        case "text":
          return <IText key={object.id} {...object} />;
        case "textbox":
          return (
            <TextLoad
              key={object.id}
              canvasScale={this.state.scale}
              {...object}
              designerCallbacks={this.designerCallbacks}
              fontSize={object.fontSize * this.state.scale}
            />
          );
        case "group":
          return (
            <Group key={object.id} {...object}>
              {this.drawElements(object._elements, false)}
            </Group>
          );
        case "graphics":
          return <GraphicsLoad key={object.id} {...object} />;
        default:
          break;
      }
      return null;
    });
    return elements;
  }

  drawHelperLines() {
    //return null;
    const { bleedLines } = this.props;
    const { trimboxLines } = this.props;

    const helpers = map(idx => {
      const object = { ...idx };
      let x1 = object.x,
        y1 = object.y;

      delete object.x;
      delete object.y;

      object.left = x1 * this.state.scale + this.state.canvasOffsetX;
      object.top = y1 * this.state.scale + this.state.canvasOffsetY;

      object.width =
        object.width !== 1 ? object.width * this.state.scale : object.width;
      object.height =
        object.height !== 1 ? object.height * this.state.scale : object.height;

      switch (object.helper_type) {
        case "bleedbox":
          return <BleedBox {...object} />;
        case "trimbox":
          return <TrimBox {...object} />;
        default:
          return null;
      }
    }, concat(bleedLines, trimboxLines));
    return helpers;
  }

  render() {
    const { activePage: page } = this.props;
    const { objects } = page;
    let elements = this.drawElements(objects, 1);
    let helperElements = null;
    if (!this.props.viewOnly) {
      helperElements = this.drawHelperLines();
    }
    let isReadyComponent = this.state.isReadyComponent;

    return (
      <div className="render-container">
        <div
          style={{ background: "#F3F4F6" }}
          className="canvasContainer"
          ref={this.editorContainer}
        >
          {isReadyComponent && (
            <Fabric
              width={this.state.width}
              height={this.state.height}
              canvasOffsetX={this.state.canvasOffsetX}
              canvasOffsetY={this.state.canvasOffsetY}
              canvasScale={this.state.scale}
              canvasWorkingWidth={this.state.canvasWorkingWidth}
              canvasWorkingHeight={this.state.canvasWorkingHeight}
              events={this.state.events}
              canvasReadyHandler={this.props.canvasReadyHandler}
            >
              {elements}
              {helperElements}
            </Fabric>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    activePage: activePageSelector(state),
    trimboxLines: trimboxLinesSelector(state),
    bleedLines: bleedLinesSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addObjectToSelectedHandler: id => dispatch(addObjectIdToSelected(id)),
    removeSelection: args => dispatch(removeSelection(args)),
    updateObjectProps: args => dispatch(updateObjectProps(args)),
    updateSelectionObjectsCoordsHandler: props =>
      dispatch(updateSelectionObjectsCoords(props)),
    updateCropParams: (id, props) =>
      dispatch(
        projectActions.updateCropParams({
          id,
          props
        })
      ),
    canvasReadyHandler: isReady =>
      dispatch(rendererActions.updateCanvasReady(isReady)),
    uiUpdateWorkAreaOffsetPageOfsset: (workArea, scale, canvas) =>
      dispatch(
        uiActions.uiUpdateWorkAreaOffsetPageOfsset({
          workArea: workArea,
          scale: scale,
          canvas: canvas
        })
      )
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(FabricRenderer);
