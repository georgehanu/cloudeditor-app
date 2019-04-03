const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const {
  getStepsSelector,
  getActiveStepSelector
} = require("../store/selectors/lpf");
require("./StepChooser.css");

const { changeStep } = require("../store/actions/lpf");
const Step = require("./components/Step");
class StepChooser extends React.Component {
  onClickStepStepHandler = payload => {
    this.props.changeStepHandler(payload);
  };
  render() {
    let order = 1;
    const steps = Object.keys(this.props.steps).map(key => {
      return (
        <Step
          activeStep={this.props.activeStep}
          order={order++}
          {...this.props.steps[key]}
          key={key}
          changeStepHandler={this.onClickStepStepHandler}
        />
      );
    });
    return <div className="stepChooserContainer">{steps}</div>;
  }
}
const mapStateToProps = (state, _) => {
  return {
    steps: getStepsSelector(state),
    activeStep: getActiveStepSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    changeStepHandler: payload => dispatch(changeStep(payload))
  };
};
const StepChooserPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("StepChooser")(StepChooser));

module.exports = {
  StepChooser: StepChooserPlugin
};
