const React = require("react");
const TableHeader = require("../TableHeader/TableHeader");
const { withState, withHandlers, compose } = require("recompose");

const enhance = compose(
  withState("expanded", "setExpanded", false),
  withHandlers({
    handleClick: props => event => {
      props.setExpanded(!props.expanded);
    }
  })
);

const ToggleTable = props => {
  const className =
    "tableContainerExternal " +
    (props.expanded === false ? "tableContainerExternalHidden" : "");
  return (
    <React.Fragment>
      <TableHeader
        text={props.TableName}
        expanded={props.expanded}
        handleClick={props.handleClick}
        t={props.t}
      />
      <div className={className}>{props.children}</div>
    </React.Fragment>
  );
};

module.exports = enhance(ToggleTable);
