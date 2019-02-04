const { connect } = require("react-redux");
const React = require("react");
const memoize = require("memoize-one").default;
const { pathOr } = require("ramda");

const {
  getCompleteVariableByName
} = require("../../../../../core/stores/selectors/variables");

const {
  getCompleteVariable,
  getCompleteVariables
} = require("../../../../../core/utils/VariableUtils");

const withVariables = WrappedComponent => {
  class WithVariables extends React.PureComponent {
    render() {
      const { variable: inputVar, configs, ...otherProps } = this.props;

      const variable = getCompleteVariable(inputVar, configs);
      const inputProps = {
        class: variable.additional.inputClasses.join(" "),
        label: variable.label,
        type: "text",
        maxLength: variable.specific.length,
        text: variable.value,
        name: variable.name
      };
      return <WrappedComponent {...inputProps} {...otherProps} />;
    }
  }

  WithVariables.displayName = `WithVariables(${WrappedComponent.displayName})`;

  function mapStateToProps(state, props) {
    return { variable: getCompleteVariableByName(state, props.varName) };
  }

  function mapDispatchToProps(dispatch) {
    return {};
  }

  return WithVariables;
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(WithVariables);
};

module.exports = withVariables;
