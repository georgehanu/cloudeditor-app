const React = require("react");
const ObjectBlock = require("../Objects/Object/Object");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const {
  createSelectorWithDependencies: createSelector,
  registerSelectors
} = require("reselect-tools");

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
    const { innerPages, viewOnly } = this.props;
    return Object.keys(objects).map(obKey => {
      return (
        <ObjectBlock key={obKey} {...objects[obKey]} viewOnly={viewOnly} />
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
      marginTop
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
        {/* this.renderObjects() */}
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

  const getObjectList = createSelector(
    getScaledDisplayedPageSelector,
    scaledPage => {
      console.log("objectList", scaledPage);
    }
  );
  const mapStateToProps = (state, props) => {
    const scaledPage = getScaledDisplayedPageSelector(state, props);
    return {
      ...scaledPage,
      objectList: getObjectList(state, props)
    };
  };
  return mapStateToProps;
};
module.exports = hot(module)(connect(makeMapStateToProps)(Page));
