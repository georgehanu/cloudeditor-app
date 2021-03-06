const React = require("react");
const CustomSlider = require("../ReWrite/CustomSlider");
const UploadImage = require("../LayoutItems/UploadImage");
const { dagChangeSlider } = require("../../../store/actions");

const { connect } = require("react-redux");

class SliderCarousel extends React.Component {
  state = {
    showFullSlider: false
  };

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

  componentDidMount() {
    window.changeSlider = this.changeSlider;
    this.props.dagChangeSlider(null); // reset to 0 slider the active slider from store
  }

  render() {
    const className =
      "SliderCarousel " + (this.state.showFullSlider ? "" : "SmallSlider");
    const pages = this.props.sliderData.map((el, index) => {
      let className = "SliderPage " + el.classImg;
      return (
        <div key={index}>
          <div className={className} />
          {el.upload && <UploadImage alwaysShow={true} />}
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
      verticalSwiping: false
    };
    return (
      <div className={className}>
        <CustomSlider {...settings}>{pages}</CustomSlider>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    dagChangeSlider: increment => dispatch(dagChangeSlider(increment))
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SliderCarousel);
