const React = require("react");
const { connect } = require("react-redux");

const { setCanvas } = require("../../../utils/GlobalUtils");
const FabricRenderer = require("../reconciler/index");
const { createElement } = require("../utils/createElement");
const logger = require("../../../utils/LoggerUtils");

const uiActions = require("../../../stores/actions/ui");
class Fabric extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this._stage = createElement("Canvas", this.props, this.canvasRef.current);

    setCanvas(this._stage.instance);

    this.props.canvasReadyHandler(true);

    window.canvas = this._stage.instance;

    let elementBounding = this._stage.instance.wrapperEl.getBoundingClientRect(),
      parentElementBounding = this._stage.instance.wrapperEl.parentElement.getBoundingClientRect();

    this.props.uiUpdateContainerCanvasOffset({
      x: (parentElementBounding.width - elementBounding.width) / 2,
      y: (parentElementBounding.height - elementBounding.height) / 2
    });
    this.props.uiUpdateViewportTransform({
      a: this._stage.instance.viewportTransform[0],
      b: this._stage.instance.viewportTransform[1],
      c: this._stage.instance.viewportTransform[2],
      d: this._stage.instance.viewportTransform[3],
      e: this._stage.instance.viewportTransform[4],
      f: this._stage.instance.viewportTransform[5]
    });
    this._mountNode = FabricRenderer.createContainer(this._stage);

    FabricRenderer.updateContainer(this.props.children, this._mountNode, this);
  }

  componentDidUpdate(prevProps, prevState) {
    logger.info("componentDidUpdate");
    this._stage._applyProps(this.props, prevProps);

    FabricRenderer.updateContainer(this.props.children, this._mountNode, this);
  }
  componentWillUnmount() {
    FabricRenderer.updateContainer(null, this._mountNode, this);
    this._stage.destroy();
  }

  render() {
    const props = this.props;
    return (
      <React.Fragment>
        <canvas ref={this.canvasRef} />
      </React.Fragment>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    uiUpdateContainerCanvasOffset: props =>
      dispatch(uiActions.uiUpdateContainerCanvasOffset(props)),
    uiUpdateViewportTransform: props =>
      dispatch(uiActions.uiUpdateViewportTransform(props))
  };
};

module.exports = connect(
  null,
  mapDispatchToProps
)(Fabric);
