const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const {
  getStepsSelector,
  getActiveStepSelector
} = require("../store/selectors/lpf");
require("./StepChooser.css");
const Step = require("./components/Step");
class StepChooser extends React.Component {
  render() {
    let order = 1;
    const steps = Object.keys(this.props.steps).map(key => {
      return (
        <Step
          activeStep={this.props.activeStep}
          order={order++}
          {...this.props.steps[key]}
          key={key}
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
const StepChooserPlugin = connect(
  mapStateToProps,
  null
)(withNamespaces("StepChooser")(StepChooser));

module.exports = {
  StepChooser: StepChooserPlugin
};
