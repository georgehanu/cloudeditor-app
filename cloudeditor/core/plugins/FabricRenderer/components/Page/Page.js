const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { forEachObjIndexed } = require("ramda");

const {
  createDeepEqualSelector: createSelector
} = require("../../../../rewrites/reselect/createSelector");

const {
  scaledDisplayedPageSelector
} = require("../../../../stores/selectors/Html5Renderer");

const { Fabric } = require("../../fabric/index");

const Boxes = require("../Boxes/Boxes");
const Objects = require("../Objects/Objects");
const ObjectBlock = require("../Objects/Object");

const centerPage = ({ width, height, containerWidth, containerHeight }) => {
  const pageOffsetX = !(width > containerWidth)
    ? (containerWidth - width) / 2
    : 0;

  const pageOffsetY = !(height > containerHeight)
    ? (containerHeight - height) / 2
    : 0;

  return {
    pageOffsetX,
    pageOffsetY
  };
};

class Page extends React.Component {
  render() {
    const {
      containerWidth,
      containerHeight,
      scale,
      width,
      height,
      objectsOffsetList: objects,
      viewOnly,
      events
    } = this.props;

    const { pageOffsetX, pageOffsetY } = centerPage(this.props);

    return (
      <React.Fragment>
        <Fabric
          width={containerWidth}
          height={containerHeight}
          canvasOffsetX={pageOffsetX}
          canvasOffsetY={pageOffsetY}
          canvasScale={scale}
          canvasWorkingWidth={width}
          canvasWorkingHeight={height}
          events={events}
          canvasReadyHandler={() => {}}
        >
          <Objects
            objects={objects}
            pageOffsetX={pageOffsetX}
            pageOffsetY={pageOffsetY}
            scale={scale}
            viewOnly={viewOnly}
            designerCallbacks={this.props.designerCallbacks}
          />
          <Boxes
            boxes={this.props.boxes}
            offsetX={pageOffsetX}
            offsetY={pageOffsetY}
            width={this.props.width}
            height={this.props.height}
            scale={scale}
          />
        </Fabric>
      </React.Fragment>
    );
  }
}
const makeMapStateToProps = (state, props) => {
  const activePage = (_, props) => {
    return props.activePage;
  };

  const scale = (_, props) => {
    return props.scale;
  };

  const getScaledDisplayedPageSelector = scaledDisplayedPageSelector(
    activePage,
    scale
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
      objectsOffsetList: getObjectsOffsetsList(state, props)
    };
  };
  return mapStateToProps;
};
module.exports = hot(module)(connect(makeMapStateToProps)(Page));
