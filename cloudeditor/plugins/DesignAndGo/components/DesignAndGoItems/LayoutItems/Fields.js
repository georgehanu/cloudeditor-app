const React = require("react");
const Input = require("./Input");
const Text = require("./Text");
const ColorButtonGroup = require("./ColorButtonGroup");
const UploadImage = require("./UploadImage");

const Types = require("../../DesignAndGoConfig/types");
const { dagDataItemsSelector } = require("../../../store/selectors");
const { dagChangeInput } = require("../../../store/actions");

const { connect } = require("react-redux");

const Fields = props => {
  const items = props.items.map((el, index) => {
    if (el.type === Types.INPUT) {
      return <Input key={index} {...el} onInputChange={props.dagChangeInput} />;
    } else if (el.type === Types.TEXT) {
      return <Text key={index} {...el} />;
    } else if (el.type === Types.UPLOAD_IMAGE) {
      return <UploadImage key={index} {...el} />;
    } else if (el.type === Types.COLOR) {
      return <ColorButtonGroup key={index} {...el} />;
    }
  });

  return <div className="FieldsContainer">{items}</div>;
};

const mapStateToProps = state => {
  return {
    items: dagDataItemsSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dagChangeInput: event =>
      dispatch(
        dagChangeInput({ name: event.target.name, value: event.target.value })
      )
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Fields);
