const React = require("react");
const CustomSlider = require("../ReWrite/CustomSlider");
const UploadImage = require("../LayoutItems/UploadImage");
const { dagChangeSlider } = require("../../../store/actions");
const { changePage } = require("../../../../../core/stores/actions/project");
const { getCanvasImage } = require("../../../../../core/utils/GlobalUtils");

const { connect } = require("react-redux");

class SliderCarousel extends React.Component {
  state = {
    showFullSlider: false,
    currentSlider: 0,
    labels: {}
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const currentSlider = prevState.currentSlider;
    return {
      labels: {
        [currentSlider]: getCanvasImage()
      }
    };
  }

  changeSlider = (value, increment) => {
    if (value && this.state.showFullSlider) {
      return false;
    }
    this.setState({ showFullSlider: !this.state.showFullSlider });
    if (increment !== undefined) {
      this.props.dagChangeSlider(increment);
    }
    return !this.state.showFullSlider;
  };

  beforeChangeHandler = (onldIndex, newIndex) => {
    const pageIndex = this.props.sliderData[newIndex].pageNo;
    this.props.changePage(this.props.pagesOrder[pageIndex]);
    this.setState({
      currentSlider: newIndex
    });
  };

  // afterChangeHandler = index => {
  //   this.setState({
  //     currentSlider: index,
  //     labels: {
  //       ...this.state.labels,
  //       [index]: getCanvasImage()
  //     }
  //   });
  // };

  componentDidMount() {
    window.changeSlider = this.changeSlider;
    this.props.dagChangeSlider(null); // reset to 0 slider the active slider from store
  }

  render() {
    const className =
      "SliderCarousel " + (this.state.showFullSlider ? "" : "SmallSlider");
    const pages = this.props.sliderData.map((el, index) => {
      const label = this.state.labels[index] || null;
      let labelStyle = {
        left: el.labelArea.left + "%",
        top: el.labelArea.top + "%",
        width: el.labelArea.width + "%",
        height: el.labelArea.height + "%"
      };

      if (label) {
        labelStyle["backgroundImage"] = "url(" + label + ")";
      }
      return (
        <div key={index}>
          <div className="SliderPage">
            <div className="productContainer">
              <img
                src={"editorImages/" + el.productImage}
                className="productImage"
                alt=""
              />
              <div className="productLabel" style={labelStyle} />
            </div>
          </div>
          {/* {el.upload && <UploadImage alwaysShow={false} />} */}
        </div>
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
      // afterChange: index => {
      //   this.afterChangeHandler(index);
      // },
      beforeChange: (onldIndex, newIndex) => {
        this.beforeChangeHandler(onldIndex, newIndex);
      }
    };
    return (
      <div className={className}>
        <CustomSlider {...settings}>{pages}</CustomSlider>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    pagesOrder: state.project.pagesOrder,
    // variables: state.variables.variables,
    // objects: state.project.objects,
    renderId: state.designAndGo.renderId
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
