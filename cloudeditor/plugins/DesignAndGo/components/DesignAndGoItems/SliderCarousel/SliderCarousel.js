const React = require("react");
const CustomSlider = require("../ReWrite/CustomSlider");
const UploadImage = require("../LayoutItems/UploadImage");

const { dagRealDimensionSelector } = require("../../../store/selectors");
const { dagChangeSlider } = require("../../../store/actions");
const { changePage } = require("../../../../../core/stores/actions/project");
const { getCanvasImage } = require("../../../../../core/utils/GlobalUtils");

const { connect } = require("react-redux");

const SliderItem = require("./SliderItem/SliderItem");
const SliderFabrics = require("./SliderFabrics/SliderFabrics");

class SliderCarousel extends React.Component {
  state = {
    showFullSlider: false,
    currentSlider: 0,
    labels: {}
  };

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.renderId !== this.props.renderId) {
      const currentSlider = this.state.currentSlider;
      this.setState({
        labels: {
          ...this.state.labels,
          [currentSlider]: getCanvasImage()
        }
      });
    }
  }

  changeSlider = (value, increment) => {
    if (value && this.state.showFullSlider) {
      return false;
    }
    //this.setState({ showFullSlider: !this.state.showFullSlider });
    if (increment !== undefined) {
      this.props.dagChangeSlider(increment);
    }
    return !this.state.showFullSlider;
  };

  beforeChangeHandler = (onldIndex, newIndex) => {
    const pageIndex = this.props.products[newIndex].pageNo;
    this.props.changePage(this.props.pagesOrder[pageIndex]);
    this.setState({
      currentSlider: newIndex
    });
  };

  componentDidMount() {
    window.changeSlider = this.changeSlider;
    this.props.dagChangeSlider(null); // reset to 0 slider the active slider from store
  }

  render() {
    const className =
      "SliderCarousel " +
      (this.state.showFullSlider ? "SmallSlider" : "SmallSlider");

    const { labelRealDimension } = this.props;
    const productsSlider = this.props.products.map((product, index) => {
      const active = this.state.currentSlider === index;
      return (
        <SliderItem
          key={product.id}
          active={active}
          {...product}
          labelImage={this.state.labels[index]}
          labelRealDimension={labelRealDimension}
        />
      );
    });

    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: false,
      draggable: false,
      verticalSwiping: false,
      className: "testClassName",
      centerPadding: "0px",
      // afterChange: index => {
      //   this.afterChangeHandler(index);
      // },
      beforeChange: (onldIndex, newIndex) => {
        this.beforeChangeHandler(onldIndex, newIndex);
      }
    };
    return (
      <React.Fragment>
        <div className={className}>
          <CustomSlider {...settings}>{productsSlider}</CustomSlider>
        </div>
        <SliderFabrics />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    pagesOrder: state.project.pagesOrder,
    renderId: state.designAndGo.renderId,
    labelRealDimension: dagRealDimensionSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dagChangeSlider: increment => dispatch(dagChangeSlider(increment)),
    changePage: pageId => dispatch(changePage(pageId))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SliderCarousel);
