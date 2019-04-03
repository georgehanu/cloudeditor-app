const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const isEqual = require("react-fast-compare");
require("./PrintOptionsConfigurator.css");
const PrintOption = require("./components/PrintOption");
const {
  getPrintOptionsInformation,
  getPrintOptionsSelector
} = require("../../../../core/stores/selectors/productinformation");
const {
  startChangePrintOptions
} = require("../../../../core/stores/actions/productInformation");

class PrintOptionsConfigurator extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };
  render() {
    const poInfo = this.props.printOptionsInfo[this.props.activeStep.pp][
      this.props.activeStep.po
    ];
    const printoptions = Object.keys(poInfo.options).map((option, index) => {
      return (
        <PrintOption
          {...poInfo.options[option]}
          key={option}
          pp={this.props.activeStep.pp}
          po={this.props.activeStep.po}
          printOptions={this.props.printOptions}
          onChangeOptionHandler={this.props.onStartChangeOptions}
        />
      );
    });
    return (
      <div className="printOptionsConfiguratorContainer">{printoptions}</div>
    );
  }
}
const mapStateToProps = state => {
  return {
    printOptionsInfo: getPrintOptionsInformation(state),
    printOptions: getPrintOptionsSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onStartChangeOptions: payload => dispatch(startChangePrintOptions(payload))
  };
};

const PrintOptionsConfiguratorPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("PrintOptionsConfigurator")(PrintOptionsConfigurator));

module.exports = {
  PrintOptionsConfigurator: assign(PrintOptionsConfiguratorPlugin, {
    StepsConfigurator: {
      position: 2,
      priority: 1,
      type: "print_options"
    }
  })
};
