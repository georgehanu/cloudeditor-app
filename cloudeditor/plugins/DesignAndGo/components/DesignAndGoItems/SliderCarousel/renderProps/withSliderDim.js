const React = require("react");
const { debounce } = require("underscore");

const $ = require("jquery");

require("./withSliderDim.css");

class WithSliderDim extends React.Component {
  state = {
    width: null,
    height: null
  };
  constructor(props) {
    super(props);
    this.itemRef = React.createRef();
  }

  updateDimensions() {
    if (this.itemRef.current && this.props.active) {
      let resizedFinished = null;
      clearTimeout(resizedFinished);
      resizedFinished = setTimeout(() => {
        if (this.itemRef.current) {
          const $el = $(this.itemRef.current);
          if (
            $el.width() !== this.state.width ||
            $el.height() !== this.state.height
          ) {
            this.setState({
              width: $el.width(),
              height: $el.height()
            });
          }
        }
      }, 50);
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener(
      "resize",
      debounce(this.updateDimensions.bind(this), 50)
    );
  }

  componentDidUpdate() {
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    return (
      <div
        className={
          this.props.hideProductContainer
            ? "renderContainer"
            : "productSliderContainer"
        }
        ref={this.itemRef}
      >
        {this.props.children(this.state)}
      </div>
    );
  }
}

module.exports = WithSliderDim;
