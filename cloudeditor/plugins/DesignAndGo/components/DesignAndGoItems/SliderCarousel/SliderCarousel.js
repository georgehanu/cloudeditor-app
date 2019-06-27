const React = require("react");
const CustomSlider = require("../ReWrite/CustomSlider");
const UploadImage = require("../LayoutItems/UploadImage");

const {
  dagRealDimensionSelector,
  dagProductColorsSelector,
  dagActiveSliderSelector
} = require("../../../store/selectors");
const { dagChangeSlider } = require("../../../store/actions");
const { changePage } = require("../../../../../core/stores/actions/project");
const { getCanvasImage } = require("../../../../../core/utils/GlobalUtils");
const {
  changeColorVariableValue
} = require("../../../../../core/stores/actions/variables");
const { connect } = require("react-redux");

const SliderItem = require("./SliderItem/SliderItem");

class SliderCarousel extends React.Component {
  state = {
    showFullSlider: false,
    currentSlider: 0,
    labels: {}
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.productColors !== prevState.productColors &&
      nextProps.dagActiveSlider !== prevState.dagActiveSlider
    ) {
      if (
        nextProps.productColors.colors.length === 0 &&
        nextProps.productColors.colorPicker === false
      ) {
        nextProps.changeColorVariableValue({});
      } else if (
        nextProps.productColors.activeColorButton ===
        nextProps.productColors.colors.length
      ) {
        nextProps.changeColorVariableValue({
          color1: nextProps.productColors.palleteBgColor
        });
      } else {
        nextProps.changeColorVariableValue(
          nextProps.productColors.colors[
            nextProps.productColors.activeColorButton
          ]
        );
      }

      return {
        ...prevState,
        productColors: nextProps.productColors,
        dagActiveSlider: nextProps.dagActiveSlider
      };
    }

    return null;
  }

  componentDidUpdate(previousProps, previousState) {
    if (
      previousProps.renderId !== this.props.renderId ||
      previousProps.dagActiveSlider !== this.props.dagActiveSlider
    ) {
      const currentSlider = this.state.currentSlider;
      this.setState({
        labels: {
          ...this.state.labels,
          [currentSlider]: getCanvasImage()
        }
      });
    }
  }

  beforeChangeHandler = (onldIndex, newIndex) => {
    const pageIndex = this.props.products[newIndex].pageNo;
    this.props.changePage(this.props.pagesOrder[pageIndex]);
    this.setState({
      currentSlider: newIndex
    });
    this.props.dagChangeSlider(newIndex);
  };

  afterChangeHandler = index => {};

  componentDidMount() {
    window.dgSlider = this.slider;
    //this.props.dagChangeSlider(0); // reset to 0 slider the active slider from store
    if (this.props.dagActiveSlider !== 0) {
      this.slider.slickNext();
      this.slider.slickGoTo(this.props.dagActiveSlider);
    }
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
      afterChange: index => {
        this.afterChangeHandler(index);
      },

      beforeChange: (onldIndex, newIndex) => {
        this.beforeChangeHandler(onldIndex, newIndex);
      }
    };
    return (
      <div className={className}>
        <CustomSlider ref={slider => (this.slider = slider)} {...settings}>
          {productsSlider}
        </CustomSlider>
        <div
          className="zoomSliderContainer"
          onClick={this.props.onZoomImageHandler}
        >
          <span className="zoomCanvasButton icon awesome-plus" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    pagesOrder: state.project.pagesOrder,
    renderId: state.designAndGo.renderId,
    labelRealDimension: dagRealDimensionSelector(state),
    productColors: dagProductColorsSelector(state.designAndGo),
    dagActiveSlider: dagActiveSliderSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dagChangeSlider: increment => dispatch(dagChangeSlider(increment)),
    changePage: pageId => dispatch(changePage(pageId)),
    changeColorVariableValue: color => dispatch(changeColorVariableValue(color))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SliderCarousel);
