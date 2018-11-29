const React = require("react");
const PropTypes = require("prop-types");
const { debounce } = require("underscore");
const randomColor = require("randomcolor");

const uuidv4 = require("uuid/v4");
const { connect } = require("react-redux");
const { forEach } = require("ramda");
require("./Html5.css");

const { snapLinesSelector } = require("../../stores/selectors/Html5/SnapLines");
const { zoomSelector } = require("../../stores/selectors/project");
const {
  updateObjectProps,
  changePage,
  removeSelection,
  onTextChange
} = require("../../stores/actions/project");
const { changeWorkareaProps } = require("../../stores/actions/ui");

const Objects = require("./Html5/Objects/Objects");
const Lines = require("./Html5/SnapLines");
const Boxes = require("./Html5/Boxes/Boxes");

class Html5Renderer extends React.Component {
  state = {
    scale: 1,
    componentReady: false,
    blurSelectors: ["pageBlock active", "ToolbarContainer", "Toolbar"]
  };

  constructor(props) {
    super(props);
    this.canvasContainerRef = React.createRef();
    this.pageContainerRef = React.createRef();
  }
  changePageHandler(params) {
    this.props.onChangePageHandler(params);
  }
  shouldComponentUpdate() {
    if (!this.props.viewOnly) {
      return true;
    }
    if (this.props.viewOnly) {
      if (this.props.active || this.props.initial) {
        return true;
      }
      return false;
    }
    return true;
  }
  updatePageOffset = () => {
    const canvasContainer = this.canvasContainerRef.current;
    if (canvasContainer) {
      const page = {
          width: this.props.width,
          height: this.props.height
        },
        canvas = {
          width: canvasContainer.offsetWidth,
          height: canvasContainer.offsetHeight
        };

      let scale = Math.min(
        canvas.width / page.width,
        canvas.height / page.height
      );

      this.setState({ scale: scale, componentReady: true }, () => {
        this.updateWorkArea();
      });
    }
  };

  updateWorkArea() {
    const canvasContainer = this.canvasContainerRef.current;
    const scale = this.state.scale;
    if (canvasContainer && !this.props.viewOnly) {
      const pageContainerRef = this.pageContainerRef.current;
      if (pageContainerRef) {
        const pageContainerRefBounding = pageContainerRef.getBoundingClientRect();
        const canvasContainerParent = canvasContainer.parentElement.getBoundingClientRect();
        const workArea = {
          scale: scale,
          pageOffset: {
            x: pageContainerRefBounding.x - canvasContainerParent.x,
            y: pageContainerRefBounding.y - canvasContainerParent.y
          }
        };
        this.props.onChangeWorkAreaProps(workArea);
      }
    }
  }
  blurPage(event) {
    let isBlur = true;
    const target = event.target;
    const blurSelectors = this.state.blurSelectors;
    forEach(blurselector => {
      const elements = document.getElementsByClassName(blurselector);
      forEach(element => {
        if (element == target) {
          isBlur = false;
        }
        if (element.contains(target)) {
          isBlur = false;
        }
      }, elements);
    }, blurSelectors);
    if (isBlur) {
      this.props.onRemoveActiveBlockHandler({});
    }
  }
  componentDidMount() {
    this.updatePageOffset();
    window.addEventListener("resize", debounce(this.updatePageOffset));
    if (!this.props.viewOnly) {
      document.removeEventListener("click", this.blurPage);
      document.addEventListener("click", this.blurPage.bind(this));
    }
  }
  render() {
    let page = null;
    if (this.state.componentReady) {
      let { width, height } = this.props;
      const scale = this.state.scale;
      let zoom = this.props.zoom;
      if (this.props.viewOnly) {
        zoom = 1;
      }
      const zoomScale = scale + ((zoom * 100 - 100) / 100) * scale;
      const widthScale = width * zoomScale;
      const heightScale = height * zoomScale;
      width *= scale;
      height *= scale;

      let LinesRender = null;
      let BoxesRender = null;
      if (!this.props.viewOnly) {
        LinesRender = <Lines lines={this.props.snapLines} scale={zoomScale} />;
        BoxesRender = <Boxes scale={zoomScale} />;
      }
      let overlays = null;
      if (!this.props.viewOnly) {
        overlays = this.props.overlays.map(overlay => {
          const overlayStyle = {
            width: overlay.width * zoomScale,
            height: overlay.height * zoomScale,
            left: overlay.left * zoomScale
          };
          return (
            <div
              key={overlay.id}
              style={overlayStyle}
              onClick={() =>
                this.changePageHandler({
                  page_id: overlay.id,
                  group_id: overlay.group_id
                })
              }
              className="overlayHelper"
            />
          );
        });
      }
      const canvasContainer = this.canvasContainerRef.current;
      const canvasContainerBounding = canvasContainer.getBoundingClientRect();
      let marginTop = (canvasContainerBounding.height - heightScale) / 2;
      let marginLeft = (canvasContainerBounding.width - widthScale) / 2;
      if (heightScale > canvasContainerBounding.height) {
        marginTop = 0;
      }
      if (widthScale > canvasContainerBounding.width) {
        marginLeft = 0;
      }
      page = (
        <div
          className={["zoom-container", zoom > 1 ? "zoom-active" : ""].join(
            " "
          )}
        >
          <div
            ref={this.pageContainerRef}
            className="page-container page"
            style={{
              width: widthScale,
              height: heightScale,
              marginTop: marginTop,
              marginLeft: marginLeft
            }}
          >
            <Objects
              viewOnly={this.props.viewOnly}
              items={this.props.objects}
              onUpdateProps={this.props.onUpdatePropsHandler}
              onTextChange={this.props.onTextChangeHandler}
              scale={zoomScale}
            />
            {BoxesRender}
            {LinesRender}
            {overlays}
            <div id="fitTextEscaper" />
          </div>
        </div>
      );
    }

    return (
      <div className="canvas-container" ref={this.canvasContainerRef}>
        {page}
      </div>
    );
  }
}

Html5Renderer.propTypes = {
  id: PropTypes.string,
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  width: PropTypes.number,
  height: PropTypes.number,
  objects: PropTypes.object,
  background: PropTypes.object
};
Html5Renderer.defaultProps = {
  id: uuidv4(),
  viewOnly: 0,
  width: 1200,
  height: 600,
  objects: {},
  background: {
    type: "none"
  }
};
const mapStateToProps = state => {
  return {
    snapLines: snapLinesSelector(state),
    zoom: zoomSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onUpdatePropsHandler: payload => dispatch(updateObjectProps(payload)),
    onChangePageHandler: payload => dispatch(changePage(payload)),
    onChangeWorkAreaProps: payload => dispatch(changeWorkareaProps(payload)),
    onRemoveActiveBlockHandler: payload => null,
    // onRemoveActiveBlockHandler: payload => dispatch(removeSelection(payload))
    onTextChangeHandler: payload => dispatch(onTextChange(payload))
  };
};
module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Html5Renderer);
