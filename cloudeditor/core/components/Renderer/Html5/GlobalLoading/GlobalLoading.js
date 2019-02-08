const React = require("react");
const { connect } = require("react-redux");
const withSpinner = require("../../../../hoc/withSpinner/withSpinner");
const {
  getLoadingStatusSelector,
  getEnabledStatusSelector
} = require("../../../../stores/selectors/globalLoading");

const GlobalLoading = props => {
  return <div className={"globalSpinner"} />;
};
const mapStateToProps = (state, props) => {
  return {
    loading: getLoadingStatusSelector(state),
    enabled: getEnabledStatusSelector(state)
  };
};
module.exports = connect(
  mapStateToProps,
  null
)(withSpinner(GlobalLoading));
