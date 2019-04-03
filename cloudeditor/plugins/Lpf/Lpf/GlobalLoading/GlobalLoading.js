const React = require("react");
const { connect } = require("react-redux");
const withSpinner = require("../../../../core/hoc/withSpinner/withSpinner");
const {
  getLoadingStatusSelector,
  getEnabledStatusSelector
} = require("../../../../core/stores/selectors/globalLoading");

const GlobalLoading = props => {
  return (
    <React.Fragment>
      <div className="globalMask" />
      <div className={"globalSpinner"} />
    </React.Fragment>
  );
};
const mapStateToProps = (state, props) => {
  return {
    loading: getLoadingStatusSelector(state),
    enabled: getEnabledStatusSelector(state)
  };
};
const GlobalLoadingPlugin = connect(
  mapStateToProps,
  null
)(withSpinner(GlobalLoading));
module.exports = {
  GlobalLoading: GlobalLoadingPlugin
};
