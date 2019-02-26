const React = require("react");
const Renderer = require("../../../../../../core/plugins/FabricRenderer/containers/Fabric");
const { connect } = require("react-redux");
const {
  dagRealDimensionSelector,

  dagActiveProductSelector
} = require("../../../../store/selectors");
const WithSliderDim = require("../renderProps/withSliderDim");

const {
  displayedPageSelector,
  activeGroupSelector
} = require("../../../../../../core/stores/selectors/Html5Renderer");
const SliderFabricsRenderer = require("./SliderFabricsRender");

class SliderFabrics extends React.Component {
  render() {
    return (
      <div className="renderOuterContainer">
        <WithSliderDim active={true} hideProductContainer={true}>
          {dim => {
            if (dim.width === null) return;
            const containerRatio = dim.width / dim.height; //parent
            const mainImage = this.props.activeProduct.mainImage;
            const imageRatio = mainImage.width / mainImage.height; //current

            let scale = 1;

            if (imageRatio < containerRatio) {
              scale = mainImage.height / dim.height;
            } else {
              scale = mainImage.width / dim.width;
            }

            /*const width =
              (this.props.labelRealDimension.width *
                this.props.activeProduct.cropArea.width) /
              this.props.activeProduct.realDimension.width /
              scale;

            const height =
              (this.props.labelRealDimension.height *
                this.props.activeProduct.cropArea.height) /
              this.props.activeProduct.realDimension.height /
              scale;
*/
            const width = this.props.activeProduct.cropArea.width / scale;
            const height = this.props.activeProduct.cropArea.height / scale;
            const top = this.props.activeProduct.cropArea.top / scale; // 200 for testing
            const left = 0; //this.props.activeProduct.cropArea.left / scale;

            const style = { width, height, top, left };

            return (
              <SliderFabricsRenderer
                propStyle={style}
                activeProduct={this.props.activeProduct}
              />
            );
          }}
        </WithSliderDim>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const getDisplayedPageSelector = displayedPageSelector(activeGroupSelector);
  return {
    activePage: getDisplayedPageSelector(state, props),
    labelRealDimension: dagRealDimensionSelector(state),
    activeProduct: dagActiveProductSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SliderFabrics);
