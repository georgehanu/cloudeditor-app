import React from "react";
import Input from "./Input";
import Text from "./Text";
import ColorButtonGroup from "./ColorButtonGroup";
import UploadImage from "./UploadImage";

import * as Types from "../../DesignAndGoConfig/types";
import { dagDataItemsSelector } from "../../../../stores/selectors/designAndGo";
import { dagChangeInput } from "../../../../stores/actions/designAndGo";

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fields);
