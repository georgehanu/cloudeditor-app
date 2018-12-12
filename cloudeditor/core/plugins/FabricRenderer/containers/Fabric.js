const React = require("react");
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { debounce } = require("underscore");
const randomColor = require("randomcolor");
const { hot } = require("react-hot-loader");
const { map, concat } = require("ramda");
const uuidv4 = require("uuid/v4");

const Canvas = require("../components/Canvas/Canvas");
const { computeScale } = require("../../../utils/UtilUtils");

const { changeWorkareaProps } = require("../../../stores/actions/ui");

const {
  addObjectIdToSelected,
  removeSelection,
  updateObjectProps,
  updateCropParams,
  updateSelectionObjectsCoords
} = require("../../../stores/actions/project");
const {
  displayedPageSelector,
  activeGroupSelector
} = require("../../../stores/selectors/Html5Renderer");
const {
  canvasSelector,
  scaleSelector
} = require("../../../stores/selectors/ui");

require("./Fabric.css");

class Fabric extends React.Component {
  state = {
    pageReady: false
  };

  constructor(props) {
    super(props);
    this.containerRef = null;
    this.events = [
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
    ];
  }

  getContainerReference = ref => {
    this.containerRef = ref;
  };

  updateContainerDimensions = () => {
    if (this.containerRef) {
      const parent = {
        width: this.containerRef.offsetWidth,
        height: this.containerRef.offsetHeight
      };
      const child = {
        width: this.props.activePage.width,
        height: this.props.activePage.height
      };

      const scale = computeScale(parent, child);

      this.props.changeWorkAreaPropsHandler({
        scale: scale,
        canvas: {
          workingWidth: parent.width,
          workingHeight: parent.height
        }
      });

      this.setState({
        pageReady: true
      });
    }
  };

  componentDidMount() {
    this.updateContainerDimensions();
    window.addEventListener("resize", this.updateContainerDimensions);
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
                left: (obj.left - obj.offsetLeft) / obj.scale,
                top: (obj.top - obj.offsetTop) / obj.scale
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
            left: (obj.left - obj.offsetLeft) / obj.scale,
            top: (obj.top - obj.offsetTop) / obj.scale,
            angle: obj.angle
          };
        }, args.deselected)
      };
      this.props.removeSelection(selectionData);
    }
  };
  onObjectPropChangedHandler = args => {
    console.log("onObjectPropChangedHandler", args);
    if (args && args.target) {
      if (args.target.type === "activeSelection") {
        let activeSelectionData = {
          id: args.target.id,
          props: args.target.getMainProps(),
          objectProps: []
        };
        this.props.updateSelectionObjectsCoordsHandler(activeSelectionData);
      } else {
        const objProps = args.target.getMainProps();
        let newProps = {};
        newProps.left = (objProps.left - objProps.offsetLeft) / objProps.scale;
        newProps.top = (objProps.top - objProps.offsetTop) / objProps.scale;
        newProps.width = (objProps.width / objProps.scale) * args.target.scaleX;
        newProps.height =
          (objProps.height / objProps.scale) * args.target.scaleY;
        newProps.scaleX = 1;
        newProps.scaleY = 1;
        this.props.updateObjectProps({
          id: args.target.id,
          props: newProps
        });
      }
    }
  };
  designerCallbacks = () => {
    console.log("designerCallback");
    return {
      updateCropParams: this.props.updateCropParams,
      updateObjectProps: this.props.updateObjectProps
    };
  };

  render() {
    const { pageReady } = this.state;
    const { scale, canvasDimm } = this.props;
    return (
      <Canvas
        getContainerRef={this.getContainerReference}
        activePage={this.props.activePage}
        scale={scale}
        containerWidth={canvasDimm.workingWidth}
        containerHeight={canvasDimm.workingHeight}
        pageReady={pageReady}
        designerCallbacks={this.designerCallbacks}
        events={this.events}
      />
    );
  }
}
Fabric.propTypes = {};

Fabric.defaultProps = {};

const mapDispatchToProps = dispatch => {
  return {
    changeWorkAreaPropsHandler: payload =>
      dispatch(changeWorkareaProps(payload)),
    addObjectToSelectedHandler: id => dispatch(addObjectIdToSelected(id)),
    removeSelection: args => dispatch(removeSelection(args)),
    updateObjectProps: args => dispatch(updateObjectProps(args)),
    updateSelectionObjectsCoordsHandler: props =>
      dispatch(updateSelectionObjectsCoords(props)),
    updateCropParams: (id, props) =>
      dispatch(
        updateCropParams({
          id,
          props
        })
      )
  };
};

const makeMapStateToProps = (state, props) => {
  const getDisplayedPageSelector = displayedPageSelector(activeGroupSelector);

  const mapStateToProps = (state, props) => {
    return {
      activePage: getDisplayedPageSelector(state, props),
      canvasDimm: canvasSelector(state, props),
      scale: scaleSelector(state, props)
    };
  };
  return mapStateToProps;
};

module.exports = hot(module)(
  connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(Fabric)
);
