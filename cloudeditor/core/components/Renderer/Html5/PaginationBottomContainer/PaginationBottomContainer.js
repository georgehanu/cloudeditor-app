const React = require("react");
const { connect } = require("react-redux");

const PaginationBottomContainer = props => {
  const { viewOnly } = props;
  if (viewOnly) return null;
  let nextPageHandler = null;
  if (props.nextPage) {
    nextPageHandler = (
      <div
        className={"paginationItem"}
        onClick={() => {
          props.onClickChangePageHandler(props.nextPage);
        }}
      >
        <span className={"icon printqicon-nextarrow"} />
      </div>
    );
  }
  let prevPageHandler = null;
  if (props.prevPage) {
    prevPageHandler = (
      <div
        className={"paginationItem"}
        onClick={() => {
          props.onClickChangePageHandler(props.prevPage);
        }}
      >
        <span className={"icon printqicon-backarrow "} />
      </div>
    );
  }
  return (
    <div className={"paginationBottomContainer"}>
      <div className="previousContainer paginationSubContainer">
        {prevPageHandler}
      </div>
      <div className="nextContainer paginationSubContainer">
        {nextPageHandler}
      </div>
    </div>
  );
};

module.exports = connect(
  null,
  null
)(PaginationBottomContainer);
