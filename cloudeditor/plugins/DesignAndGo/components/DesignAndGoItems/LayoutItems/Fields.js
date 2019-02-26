const React = require("react");

const withVariable = require("../hoc/withVariable");
const Input = require("./Input");
const Text = require("./Text");
const ColorButtonGroup = require("./ColorButtonGroup");
const UploadImage = require("./UploadImage");

const InputVariable = withVariable(Input);

const Types = require("../../DesignAndGoConfig/types");
const {
  dagDataItemsSelector,
  getVariablesByFilter,
  dagProductColorsSelector,
  dagShowUploadImageSelector
} = require("../../../store/selectors");

const { dagChangeInput } = require("../../../store/actions");
const {
  testChangeVariable,
  changeVariableValue
} = require("../../../../../core/stores/actions/variables");

const { connect } = require("react-redux");

const Fields = props => {
  // const items = props.items.map((el, index) => {
  //   if (el.type === Types.INPUT) {
  //     return <Input key={index} {...el} onInputChange={props.dagChangeInput} />;
  //   } else if (el.type === Types.TEXT) {
  //     return <Text key={index} {...el} />;
  //   } else if (el.type === Types.UPLOAD_IMAGE) {
  //     return <UploadImage key={index} {...el} />;
  //   } else if (el.type === Types.COLOR) {
  //     return <ColorButtonGroup key={index} {...el} />;
  //   }
  // });

  const { variables, variablesConfigs, dagChangeInput, productColors } = props;

  let items = Object.keys(variables).map((vKey, idx) => {
    return (
      <InputVariable
        key={idx}
        varName={vKey}
        variable={variables[vKey]}
        configs={variablesConfigs}
        onInputChange={dagChangeInput}
      />
    );
  });

  let index = Object.keys(variables).length + 1;

  if (productColors.colors.length > 0) {
    items = items.concat(<ColorButtonGroup key={index++} {...productColors} />);
  }

  if (props.showUploadImage) {
    items = items.concat(<UploadImage key={index++} />);
  }

  return <div className="FieldsContainer">{items}</div>;
};

const mapStateToProps = state => {
  return {
    //items: dagDataItemsSelector(state),
    variables: getVariablesByFilter(state, "dg"),
    variablesConfigs: state.variables.configs,
    productColors: dagProductColorsSelector(state),
    showUploadImage: dagShowUploadImageSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dagChangeInput: event =>
      dispatch(
        changeVariableValue({
          name: event.target.name,
          value: event.target.value
        })
      ),
    changeVariable: () => dispatch(testChangeVariable())
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Fields);
