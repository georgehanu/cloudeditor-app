import React from "react";
import BackButton from "./BackButton";

const PaneContainer = props => {
  const className =
    "PaneContainer " + (props.visible ? "PaneShow" : "PaneHidden");
  return (
    <div className={className}>
      <BackButton clicked={props.clicked} />
      {props.children}
    </div>
  );
};

export default PaneContainer;
