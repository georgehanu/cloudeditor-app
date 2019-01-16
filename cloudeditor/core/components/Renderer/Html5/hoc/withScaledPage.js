const { compose } = require("redux");
const React = require("react");
const { connect } = require("react-redux");

const withScaledPage = WrappedComponent => props => {
  return <WrappedComponent {...props} />;
};

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

module.exports = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withScaledPage
);
