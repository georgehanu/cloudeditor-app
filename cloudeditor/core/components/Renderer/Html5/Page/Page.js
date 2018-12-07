const React = require("react");
const ObjectBlock = require("../Objects/Object/Object");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { randomColor } = require("randomColor");
const {
  /*  createSelectorWithDependencies: createSelector, */
  registerSelectors
} = require("reselect-tools");
const {
  createDeepEqualSelector: createSelector
} = require("../../../../rewrites/reselect/createSelector");
const { forEachObjIndexed } = require("ramda");
const {
  scaledDisplayedPageSelector
} = require("../../../../stores/selectors/Html5Renderer");

require("./Page.css");

const Boxes = require("../Boxes/Boxes");
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

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.pageContainerRef = React.createRef();
  }

  renderObjects() {
    const { objectsOffsetList: objects, viewOnly, zoomScale } = this.props;
    return Object.keys(objects).map(obKey => {
      return (
        <ObjectBlock
          key={obKey}
          id={obKey}
          zoomScale={zoomScale}
          {...objects[obKey]}
          viewOnly={viewOnly}
        />
      );
    });
  }

  render() {
    const { width, height } = this.props;
    const { marginLeft, marginTop } = centerPage(this.props);
    const pageStyle = {
      width,
      height,
      marginLeft,
      marginTop,
      backgroundColor: randomColor()
    };

    return (
      <div
        ref={this.props.getPageRef}
        style={pageStyle}
        className="pageContainer page"
      >
        <Boxes
          boxes={this.props.boxes}
          width={this.props.width}
          height={this.props.height}
        />
        {this.renderObjects()}
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
      objectsOffsetList: getObjectsOffsetsList(state, props)
    };
  };
  return mapStateToProps;
};
module.exports = hot(module)(connect(makeMapStateToProps)(Page));
