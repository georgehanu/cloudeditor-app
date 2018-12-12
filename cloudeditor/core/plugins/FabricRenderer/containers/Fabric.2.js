const React = require("react");
const { debounce } = require("underscore");
const { connect } = require("react-redux");
const uuidv4 = require("uuid/v4");
const { map, concat } = require("ramda");

const { computeScale } = require("../../../utils/UtilUtils");

const { Fabric } = require("../fabric/index");

const {
  displayedPageSelector,
  activeGroupSelector
} = require("../../../stores/selectors/Html5Renderer");

class FabricRenderer extends React.Component {
  state = {
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

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  updatePageOffset = () => {
    const parent = {
      width: this.containerRef.current.offsetWidth,
      height: this.containerRef.current.offsetHeight
    };
    const child = {
      width: this.props.activePage.width,
      height: this.props.activePage.height
    };

    const scale = computeScale(parent, child);

    const workingCanvas = {
      width: child.width * scale,
      height: child.height * scale
    };

    const newState = {
      isReadyComponent: true,
      width: parent.width,
      height: parent.height,
      canvasOffsetX: (parent.width - workingCanvas.width) / 2,
      canvasOffsetY: (parent.height - workingCanvas.height) / 2,
      canvasWorkingWidth: workingCanvas.width,
      canvasWorkingHeight: workingCanvas.height,
      scale: scale
    };

    this.setState(newState);
  };

  componentDidMount() {
    this.updatePageOffset();
    window.addEventListener("resize", debounce(this.updatePageOffset));
  }

  render() {
    const {
      isReadyComponent,
      width,
      height,
      canvasOffsetX,
      canvasOffsetY,
      scale,
      canvasWorkingWidth,
      canvasWorkingHeight,
      events
    } = this.state;

    //const { canvasReadyHandler } = this.props;
    const canvasReadyHandler = () => {};

    let fabric = null;

    if (isReadyComponent)
      fabric = (
        <Fabric
          width={width}
          height={height}
          canvasOffsetX={canvasOffsetX}
          canvasOffsetY={canvasOffsetY}
          canvasScale={scale}
          canvasWorkingWidth={canvasWorkingWidth}
          canvasWorkingHeight={canvasWorkingHeight}
          events={events}
          canvasReadyHandler={canvasReadyHandler}
        />
      );
    return (
      <div
        style={{ background: "red" }}
        className="canvasContainer"
        ref={this.containerRef}
      >
        {fabric}
      </div>
    );
  }
}

const makeMapStateToProps = (state, props) => {
  const getDisplayedPageSelector = displayedPageSelector(activeGroupSelector);

  const mapStateToProps = (state, props) => {
    return {
      activePage: getDisplayedPageSelector(state, props)
    };
  };
  return mapStateToProps;
};

module.exports = connect(
  makeMapStateToProps,
  null
)(FabricRenderer);
