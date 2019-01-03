const React = require("react");
const ObjectBlock = require("../Objects/Object/Object");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { DropTarget } = require("react-dnd");
const ReactDOM = require("react-dom");
const { forEachObjIndexed, forEach } = require("ramda");

const type = ["image", "text"];

const {
  createDeepEqualSelector: createSelector
} = require("../../../../rewrites/reselect/createSelector");
const {
  scaledDisplayedPageSelector
} = require("../../../../stores/selectors/Html5Renderer");
const { addObject } = require("../../../../stores/actions/project");
const {
  activePageIdSelector
} = require("../../../../stores/selectors/project");
const BlockMessage = require("../BlockMesage/BlockMessage");

require("./Page.css");

const Boxes = require("../Boxes/Boxes");
const Line = require("../Boxes/Line");
const centerPage = ({ width, height, containerWidth, containerHeight }) => {
  const marginTop = !(height > containerHeight)
    ? (containerHeight - height) / 2
    : 0;
  const marginLeft = !(width > containerWidth)
    ? (containerWidth - width) / 2
    : 0;

  return {
    marginLeft,
    marginTop
  };
};

const PageTarget = {
  drop(props, monitor, component) {
    if (monitor.isOver()) {
      const object = { ...monitor.getItem() };
      const componentBounding = ReactDOM.findDOMNode(
        component
      ).getBoundingClientRect();
      const activePageId = props.activePageId;
      innerPage = props.activePage.innerPages[activePageId];
      let aspectRatio = innerPage.height / innerPage.width;
      width = innerPage.width / 6;
      switch (object.type) {
        case "image":
          aspectRatio = object.imageHeight / object.imageWidth;
          break;
        default:
          break;
      }
      object.width = width;
      object.height = width * aspectRatio;
      const position = monitor.getSourceClientOffset();

      object.left = (-1 * (componentBounding.x - position.x)) / props.zoomScale;
      object.top = (-1 * (componentBounding.y - position.y)) / props.zoomScale;
      props.onAddObjectHandler(object);
    }
  },
  canDrop(props, monitor) {
    if (!props.viewOnly) {
      return true;
    }
    return false;
  },
  hover(props, monitor) {}
};

collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    clientOffset: monitor.getClientOffset()
  };
};

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.pageContainerRef = React.createRef();
    this.state = {
      errorMessages: []
    };
  }
  getIfMessage = (pageBounding, blockBounding) => {
    let type = 0;
    let snapTolerance = this.props.activePage.snapTolerance;
    const { zoomScale } = this.props;
    snapTolerance *= zoomScale;
    if (
      blockBounding.left < pageBounding.left + snapTolerance ||
      blockBounding.right > pageBounding.right - snapTolerance ||
      blockBounding.top < pageBounding.top + snapTolerance ||
      blockBounding.bottom > pageBounding.bottom - snapTolerance
    )
      type = 1;
    if (
      blockBounding.right < pageBounding.left ||
      blockBounding.left > pageBounding.right ||
      blockBounding.bottom < pageBounding.top ||
      blockBounding.top > pageBounding.bottom
    )
      type = 2;
    return type;
  };
  checkErrorMessages = params => {
    const { blockContainer, blockId } = params;
    let { errorMessages } = this.state;
    const pageBounding = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const blockContainerBounding = blockContainer.getBoundingClientRect();

    errorMessages[blockId] = {
      type: this.getIfMessage(pageBounding, blockContainerBounding),
      left:
        blockContainerBounding.left -
        pageBounding.left +
        blockContainerBounding.width / 2,
      top: blockContainerBounding.top - pageBounding.top,
      width: blockContainerBounding.width
    };
    this.setState({ errorMessages });
  };
  renderObjects() {
    const { objectsOffsetList: objects, viewOnly, zoomScale } = this.props;
    return Object.keys(objects).map(obKey => {
      return (
        <ObjectBlock
          key={obKey}
          id={obKey}
          zoomScale={zoomScale}
          snapTolerance={this.props.activePage.snapTolerance}
          middle={{ left: this.props.width / 2, top: this.props.height / 2 }}
          {...objects[obKey]}
          checkErrorMessages={this.checkErrorMessages}
          viewOnly={viewOnly}
        />
      );
    });
  }
  renderErrorMessages = () => {
    const { errorMessages } = this.state;
    return Object.keys(errorMessages).map(obKey => {
      return (
        <BlockMessage
          key={obKey}
          {...errorMessages[obKey]}
          objectKeys={Object.keys(this.props.objectsOffsetList)}
          id={obKey}
          delay={10000}
          viewOnly={this.props.viewOnly}
        />
      );
    });
  };
  getPageRef = () => {
    return this.ref;
  };
  render() {
    const { width, height, viewOnly } = this.props;
    const { marginLeft, marginTop } = centerPage(this.props);
    const pageStyle = {
      width,
      height,
      marginLeft,
      marginTop
    };
    let boxes = null;
    let snapBoxes = null;
    if (!viewOnly) {
      boxes = (
        <React.Fragment>
          <Boxes
            boxes={this.props.boxes}
            width={this.props.width}
            height={this.props.height}
          />
          <Boxes
            boxes={this.props.magneticBoxes}
            width={this.props.width}
            height={this.props.height}
            inlineClass={"drag_alignLines drag_alignLinesDynamic"}
          />
        </React.Fragment>
      );
      const classes = "snapLine boxLine drag_alignLines middle_snap";
      const topStyle = {
        width: this.props.width,
        left: 0,
        top: this.props.height / 2,
        height: 1
      };
      const leftStyle = {
        width: 1,
        left: this.props.width / 2,
        top: 0,
        height: this.props.height
      };

      snapBoxes = (
        <React.Fragment>
          <Line {...topStyle} classes={classes + " horizontal"} />
          <Line {...leftStyle} classes={classes + " vertical"} />
        </React.Fragment>
      );
    }

    return this.props.connectDropTarget(
      <div
        ref={this.props.getPageRef}
        style={pageStyle}
        className="pageContainer page"
      >
        {boxes}
        {snapBoxes}
        {this.renderObjects()}
        {this.renderErrorMessages()}
      </div>
    );
  }
}
const makeMapStateToProps = (state, props) => {
  const activePage = (_, props) => {
    return props.activePage;
  };

  const zoomScale = (_, props) => {
    return props.zoomScale;
  };

  const getScaledDisplayedPageSelector = scaledDisplayedPageSelector(
    activePage,
    zoomScale
  );

  const getObjectsOffsetsList = createSelector(
    getScaledDisplayedPageSelector,
    scaledPage => {
      let objectsOffset = {};
      forEachObjIndexed((innerPage, pKey) => {
        innerPage.objectsIds.map(oKey => {
          objectsOffset[oKey] = {
            offsetTop: scaledPage.offset.top + innerPage.offset.top,
            offsetLeft: scaledPage.offset.left + innerPage.offset.left
          };
        });
      }, scaledPage.innerPages);
      return objectsOffset;
    }
  );

  const mapStateToProps = (state, props) => {
    const scaledPage = getScaledDisplayedPageSelector(state, props);
    return {
      ...scaledPage,
      activePageId: activePageIdSelector(state),
      objectsOffsetList: getObjectsOffsetsList(state, props)
    };
  };
  return mapStateToProps;
};
const mapDispatchToProps = dispatch => {
  return { onAddObjectHandler: payload => dispatch(addObject(payload)) };
};
module.exports = hot(module)(
  connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(DropTarget(type, PageTarget, collectDrop)(Page))
);
