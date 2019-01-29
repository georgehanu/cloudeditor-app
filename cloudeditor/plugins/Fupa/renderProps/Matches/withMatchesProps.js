const React = require("react");
const FupaUtils = require("../../utils/FupaUtils");
const ConfigUtils = require("../../../../core/utils/ConfigUtils");

const config = ConfigUtils.getDefaults();

const withMatchesProps = React.memo(props => {
  const cfg = FupaUtils.getTableProps(
    FupaUtils.Matches.props,
    props.size,
    config
  );
  return props.children(cfg);
});

module.exports = withMatchesProps;
