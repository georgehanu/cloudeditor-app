const React = require("react");
const TableHeader = require("../TableHeader/TableHeader");
const { withState, withHandlers, compose } = require("recompose");

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
        t={props.t}
      />
      {props.expanded && props.children}
    </React.Fragment>
  );
};

module.exports = enhance(ToggleTable);
