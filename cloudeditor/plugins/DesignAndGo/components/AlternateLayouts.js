const React = require("react");
const {
  getRealWidthDimmensionSelector,
  getRealHeightDimmensionSelector,
  getAlternateLayoutsSelector
} = require("../store/selectors/alternateLayouts");
const { hot } = require("react-hot-loader");
const { connect } = require("react-redux");
const { forEachObjIndexed, toUpper } = require("ramda");
const { setAlternateLayout } = require("../../../core/stores/actions/project");
const {
  getAlternateLayoutIndex
} = require("../../../core/utils/AlternateLayoutsUtils");

class AlternateLayouts extends React.Component {
  constructor(props) {
    super(props);
  }
  getCorrectAlternateLayoutIndex = () => {
    return getAlternateLayoutIndex(
      this.props.allAlternateLayouts,
      this.props.realWidthDimmension,
      this.props.realHeightDimmension
    );
    /*
    let indexResult = -1;

    if (this.props.allAlternateLayouts.length) {
      forEachObjIndexed((alternateLayout, pKey) => {
        switch (toUpper(alternateLayout.rangeBy)) {
          case "WIDTH":
            if (
              this.props.realWidthDimmension >= alternateLayout.minDim &&
              this.props.realWidthDimmension <= alternateLayout.maxDim
            ) {
              indexResult = pKey;
            }
            break;
          case "HEIGHT":
            if (
              this.props.realHeightDimmension >= alternateLayout.minDim &&
              this.props.realHeightDimmension <= alternateLayout.maxDim
            ) {
              indexResult = pKey;
            }
            break;
          case "BOTH":
            if (
              this.props.realHeightDimmension >= alternateLayout.minDim &&
              this.props.realHeightDimmension <= alternateLayout.maxDim &&
              this.props.realWidthDimmension >= alternateLayout.minDim &&
              this.props.realWidthDimmension <= alternateLayout.maxDim
            ) {
              indexResult = pKey;
            }
            break;
          default:
            break;
        }
      }, this.props.allAlternateLayouts);
    }
    return indexResult;*/
  };
  componentDidMount() {
    /*if (this.props.realWidthDimmension && this.props.realHeightDimmension) {
      let index = this.getCorrectAlternateLayoutIndex();
      if (index) {
        this.props.setAlternateLayoutHandler({
          realDimension: {
            width: this.props.realWidthDimmension,
            height: this.props.realHeightDimmension
          },
          layout: this.props.allAlternateLayouts[index]
        });
      }
    }*/
  }
  componentDidUpdate() {
    if (this.props.realWidthDimmension && this.props.realHeightDimmension) {
      let index = this.getCorrectAlternateLayoutIndex();
      if (index) {
        this.props.setAlternateLayoutHandler({
          realDimension: {
            width: this.props.realWidthDimmension,
            height: this.props.realHeightDimmension
          },
          layout: { ...this.props.allAlternateLayouts[index] }
        });
      }
    }
  }
  render() {
    return null;
  }
}
AlternateLayouts.propTypes = {};

AlternateLayouts.defaultProps = {};

const mapDispatchToProps = dispatch => {
  return {
    setAlternateLayoutHandler: props => dispatch(setAlternateLayout(props))
  };
};

const makeMapStateToProps = (state, props) => {
  const mapStateToProps = (state, props) => {
    return {
      realWidthDimmension: getRealWidthDimmensionSelector(state, props),
      realHeightDimmension: getRealHeightDimmensionSelector(state, props),
      allAlternateLayouts: getAlternateLayoutsSelector(state, props)
    };
  };
  return mapStateToProps;
};

module.exports = hot(module)(
  connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(AlternateLayouts)
);
