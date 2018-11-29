import React from "react";

import * as Types from "../../DesignAndGoConfig/types";
import Text from "./Text";

const Description = props => {
  const items = props.items.map((el, index) => {
    if (el.type === Types.TEXT) {
      return <Text key={index} {...el} />;
    }
  });
  return <React.Fragment>{items}</React.Fragment>;
};

export default Description;
