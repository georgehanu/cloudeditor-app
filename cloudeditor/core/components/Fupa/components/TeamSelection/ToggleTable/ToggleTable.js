import React from "react";
import TableHeader from "../TableHeader/TableHeader";
import { withState, withHandlers, compose } from "recompose";

const enhance = compose(
  withState("expanded", "setExpanded", true),
  withHandlers({
    handleClick: props => event => {
      props.setExpanded(!props.expanded);
    }
  })
);

const ToggleTable = props => {
  return (
    <React.Fragment>
      <TableHeader
        text={props.TableName}
        expanded={props.expanded}
        handleClick={props.handleClick}
      />
      {props.expanded && props.children}
    </React.Fragment>
  );
};

export default enhance(ToggleTable);
